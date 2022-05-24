import { FormFieldInput } from "~/services/form/types";

function checkForFieldNameAndValue({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  let contextFieldName = context[`${field.name}`];

  // console.log({ contextFieldName });

  if (contextFieldName) {
    if (
      typeof contextFieldName?.value !== "string" &&
      typeof contextFieldName?.value !== "object"
    ) {
      console.log("bad value: ", contextFieldName.value);

      return true;
    }
  } else {
    return true;
  }

  if (field.type === "stateful-radio") {
    field.dependentChildren.forEach((fields) => {
      fields.forEach((nestedField) => {
        if (nestedField) {
          checkForFieldNameAndValue({ field: nestedField, context });
        }
      });
    });
  }

  return false;
}

function addFieldToContext({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  if (field.type !== "checkbox-group" && field.type !== "expandable-list") {
    context[`${field.name}`] = {
      value: field.initialValue || "",
      errors: [],
    };
  } else if (field.type === "checkbox-group") {
    field.checkboxes.forEach((checkbox) => {
      if (checkbox.initialValue) {
        context[`${field.name}`] = {
          // @ts-expect-error silly typescript
          value: field.initialValue || "",
          errors: [],
        };
      }
    });
  } else if (field.type === "expandable-list") {
    context[`${field.name}`] = {
      value: field.initialValue || [],
      errors: [],
    };
  }

  // console.log("adding field context: ", context);

  if (field.type === "stateful-radio") {
    field.dependentChildren.forEach((fields) => {
      fields.forEach((nestedField) => {
        if (typeof nestedField !== "undefined") {
          addFieldToContext({ field: nestedField, context });
        }
      });
    });
  }
}

export { addFieldToContext, checkForFieldNameAndValue };
