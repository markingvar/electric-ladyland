import { redirect, json } from "@remix-run/node";
import { convertSingleQuotes } from "~/services/form/shared";
import { FormFieldInput, MultiStepForm } from "./types";

// A bot entered a value into a hidden field
function honeypotFieldHasValue({ body }: { body: FormData }) {
  let honeypotField = body.get("given-name");

  // console.log({ honeypotField });

  if (honeypotField) {
    return true;
  }

  return false;
}

// Take the form values from the request
// form data and add them to context
function addFormValuesToContext({
  formType,
  formStructure,
  body,
  context,
}:
  | {
      formType: "multipart";
      context: any;
      formStructure: MultiStepForm;
      body: FormData;
    }
  | {
      formType: "basic";
      context: any;
      formStructure: FormFieldInput[];
      body: FormData;
    }): any {
  // Get the inputs from the form
  function addFieldToContext(field: FormFieldInput) {
    // Get the form field value
    let formFieldValue: string | undefined;

    if (
      field.type === "email" ||
      field.type === "password" ||
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "radio" ||
      field.type === "hidden" ||
      field.type === "stateful-radio"
    ) {
      formFieldValue =
        body.get(`${field.name}`)?.toString() ?? field.initialValue;
    }

    if (field.type === "checkbox") {
      let checkboxValue = body.get(`${field.name}`)?.toString();
      // If there is no value, the checkbox was never checked, so
      // we want to return early
      // console.log({ checkboxValue });

      if (!checkboxValue) {
        return;
      }
      formFieldValue = checkboxValue;
    }

    let errors: string[] = [];
    // If a field is required and not present, we need to add an error
    // to the field
    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "email" ||
      field.type === "password"
    ) {
      if (!formFieldValue && field.required) {
        errors.push("This field is required");
      }
    }

    if (typeof field === "object") {
      // console.log({ formFieldValue, fieldName: field.name });

      // Add the field to context
      if (formFieldValue) {
        context[`${field.name}`] = {
          value: formFieldValue,
          errors,
        };
      }
    }

    // If it is a stateful radio field, check for
    // dependent children
    if (field.type === "stateful-radio") {
      // Get the index of the selected value
      // We need this to know which children to show

      field.dependentChildren.forEach((fields) => {
        if (typeof fields !== "undefined") {
          fields.forEach((nestedField) => {
            if (nestedField) {
              addFieldToContext(nestedField);
            }
          });
        }
      });
    }

    if (field.type === "checkbox-group") {
      field.checkboxes.forEach((checkbox) => {
        // Get rid of checkbox values that might
        // exist from a previous pass
        delete context[`${checkbox.name}`];
        // console.log({ contextAfterDelete: context });

        addFieldToContext(checkbox);
      });
    }
  }

  // Use the form structure to create a context object
  if (formType === "basic") {
    formStructure.forEach((field) => {
      addFieldToContext(field);
    });
  }

  if (formType === "multipart") {
    // Get the current form step to know what to add to context
    const currentFormStep = context.currentStep;

    // console.log({ currentFormStep, formStructure, context });

    // console.log("lol: ", typeof formStructure[currentFormStep]);

    // @ts-ignore
    for (const field of formStructure[currentFormStep]?.fields) {
      if (field) {
        addFieldToContext(field);
      }
    }
  }

  // console.log({ context });
}

function validateFieldValue({
  value,
  regex,
}: {
  value: string;
  regex: string;
}) {
  let regexTestPattern = new RegExp(`${regex}`, "igm");

  value = convertSingleQuotes(value);

  // console.log({ regexTestPattern });

  // console.log("regexTest: ", regexTestPattern.test(value));

  // console.log({ value });

  return regexTestPattern.test(value);
}

// Validate a form field value (context)
// using the validation patterns outlined in formField
// If an error exists, add it to the context
// errors array
function validateFormFieldValue({
  formField,
  context,
}: {
  context: any;
  formField: FormFieldInput;
}) {
  // currentStep and formStage are context properties
  // that we don't want to validate, they are also not
  // objects

  // if (typeof formField !== "object") {
  //   console.log("I'm out..");

  //   return;
  // }
  if (formField.type === "hidden") {
    return;
  }

  if (
    formField.type === "text" ||
    formField.type === "textarea" ||
    formField.type === "email" ||
    formField.type === "password"
  ) {
    let currentFieldValue = context[`${formField.name}`].value;
    // Iterate through the validation patterns
    formField.validation.patterns.forEach((pattern, index) => {
      const valueIsValid = validateFieldValue({
        value: currentFieldValue,
        regex: pattern,
      });

      // console.log("valueIsValid: ", valueIsValid);

      // Value is not valid
      // Push current error message onto array if it isn't already there
      if (
        !valueIsValid &&
        !context[`${formField.name}`].errors.includes(
          formField.validation.messages[index]
        )
      ) {
        // console.log("add an error");

        context[`${formField.name}`].errors.push(
          formField.validation.messages[index]
        );
      }
    });
  }

  if (formField.type === "stateful-radio") {
    let currentFieldValue = context[`${formField.name}`].value;
    let { dependentChildren } = formField;
    // Get currently selected radio option
    // Get the index of the current value
    const selectedValueIndex: number =
      formField.options.indexOf(currentFieldValue);

    if (typeof dependentChildren === "object") {
      dependentChildren[selectedValueIndex].forEach((dependentField) => {
        if (typeof dependentField !== "undefined") {
          validateFormFieldValue({ context, formField: dependentField });
        }
      });
    }
  }
}

// Check for errors in context
// In basic, we want to check all of the context entries
// In multipart, we only want to check the context items
// for the current step
function checkContextForErrors({
  context,
  formType,
  formStructure,
}:
  | {
      formStructure: FormFieldInput[];
      formType: "basic";
      context: any;
    }
  | {
      formStructure: MultiStepForm;
      formType: "multipart";
      context: any;
    }): boolean {
  let errorsPresent = false;
  // Basic form
  if (formType === "basic") {
    for (const fieldValue in context) {
      // @ts-ignore
      if (fieldValue?.errors?.length >= 1) {
        errorsPresent = true;
      }

      if (errorsPresent) {
        return true;
      }
    }
  }

  if (formType === "multipart") {
    const currentFormStep = context.currentStep;

    // Using the current form step, get the context fields to
    // check for errors
    // eslint-disable-next-line no-inner-declarations
    function addFieldNameToValidateToArray(
      field: FormFieldInput,
      fieldsToValidate: string[]
    ) {
      fieldsToValidate.push(field.name);

      if (field.type === "stateful-radio") {
        let selectedIndex = field.options.indexOf(
          context[`${field.name}`].value
        );
        field.dependentChildren[selectedIndex].forEach((nestedField) => {
          if (nestedField) {
            fieldsToValidate.push(nestedField.name);
          }
        });
      }
    }
    // We only care about the context values in the current step
    let fieldsToValidate: string[] = [];

    // @ts-ignore
    for (const field of formStructure[currentFormStep]?.fields) {
      // console.log({ field });

      if (context) addFieldNameToValidateToArray(field, fieldsToValidate);
    }

    // console.log({ fieldsToValidate });

    for (const fieldToValidate of fieldsToValidate) {
      if (context[`${fieldToValidate}`]?.errors?.length >= 1) {
        errorsPresent = true;
      }

      if (errorsPresent) {
        return true;
      }
    }
  }
  return false;
}

// Takes in the data (context), success redirect path, and
// session and commitSession function
async function handleFormData({
  handleDataFn,
  context,
  successRedirectPath,
  session,
  commitSession,
  request,
}: {
  handleDataFn: any;
  context: any;
  successRedirectPath: string;
  session: any;
  commitSession: any;
  request: Request;
}) {
  // handle data - the data function should return a tuple
  // the first item in the tuple will be a boolean to indicate
  // whether the operation succeeded or failed

  // The second item in the tuple is the success or error message
  let handleDataResult: [boolean, string] = await handleDataFn(
    context,
    request
  );
  let [success, message] = handleDataResult;

  if (success) {
    context.dataHandlerSuccessMessage = message;
    context.dataHandlerErrorMessage = "";
    session.set("context", context);

    return redirect(successRedirectPath, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    context.dataHandlerSuccessMessage = "";
    context.dataHandlerErrorMessage = message;
    session.set("context", context);

    return json(
      {},
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}

export {
  honeypotFieldHasValue,
  addFormValuesToContext,
  validateFormFieldValue,
  validateFieldValue,
  checkContextForErrors,
  handleFormData,
};
