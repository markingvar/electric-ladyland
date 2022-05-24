import { FormFieldInput, MultiStepForm } from "~/services/form/types";
import {
  getSession,
  commitSession,
  destroySession,
} from "~/services/form/session.server";
import { json } from "@remix-run/node";
import { addFieldToContext, checkForFieldNameAndValue } from "./loader-utils";
import { getFormStage } from "./shared";

async function formLoaderFunction({
  formType,
  request,
  formStructure,
}:
  | {
      formType: "multipart";
      request: Request;
      formStructure: MultiStepForm;
    }
  | {
      formType: "basic";
      request: Request;
      formStructure: FormFieldInput[];
    }): Promise<any> {
  // Get current session
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  console.log("here's your context", context);

  // Check to see if the current context matches the current
  // form structure
  // If it does not match, we want to reset it
  // @ts-expect-error overloads not externally visible
  context = checkExistingContext({ formStructure, formType, context });

  // console.log({ context });
  // If the context object doesn't have any length, we
  // know that it is empty and we need to seed it
  if (Object.keys(context).length < 1) {
    // @ts-expect-error overload not externally visible
    context = seedContextWithInitialValues({ formStructure, formType });
  }

  // Get the current step
  context?.currentStep ?? 0;

  // We should never have a negative number
  // for the current step
  if (context.currentStep < 0) {
    context.currentStep = 0;
  }

  if (formType === "multipart") {
    let formStage = getFormStage({ context, formStructure });

    // console.log({ formStage, context });

    if (context.currentStep > 0 && Object.keys(context).length < 1) {
      console.log("You shouldn't be here");

      return json(
        {},
        {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        }
      );
    }

    context.formStage = formStage;
    // @ts-ignore
    context.nextButtonText = formStructure[context.currentStep]?.nextButtonText;
    // @ts-ignore
    context.backButtonText = formStructure[context.currentStep]?.backButtonText;
  }

  session.set("context", context);

  if (formType === "multipart") {
    return {
      context,
      // @ts-ignore
      formStructure: formStructure[context.currentStep]?.fields,
      commitSession,
      session,
      commitSessionFn: async () => {
        await commitSession(session);
      },
    };
  } else {
    return {
      context,
      formStructure,
      commitSession,
      session,
      commitSessionFn: async () => {
        await commitSession(session);
      },
    };
    // return json(
    //   { context, formStructure },
    //   {
    //     headers: {
    //       "Set-Cookie": await commitSession(session),
    //     },
    //   },
    // );
  }
}

// Check to see if the context applies to the current form

function checkExistingContext({
  formType,
  formStructure,
  context,
}:
  | {
      formType: "basic";
      formStructure: FormFieldInput[];
      context: any;
    }
  | {
      formType: "multipart";
      formStructure: MultiStepForm;
      context: any;
    }): any {
  // If context does not exist, return early. We will need to
  // seed the context with initial values
  if (!context) {
    // console.log("No Existing Context");

    return false;
  }

  let incorrectContext = false;

  if (formType === "multipart") {
    for (const step of formStructure) {
      // @ts-ignore
      for (const field of step?.fields) {
        if (incorrectContext) {
          return {};
        }

        incorrectContext = checkForFieldNameAndValue({ field, context });
      }
    }
  }

  if (formType === "basic") {
    // @ts-ignore
    for (const field of formStructure) {
      if (incorrectContext) {
        return {};
      }

      // @ts-ignore
      incorrectContext = checkForFieldNameAndValue({ field, context });
    }
  }

  return context;
}

function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "multipart";
  formStructure: MultiStepForm;
}): any;
function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "basic";
  formStructure: FormFieldInput[];
}): any;
function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "multipart" | "basic";
  formStructure: MultiStepForm | FormFieldInput[];
}): any {
  // Give the context object initial values
  let context: any = {};

  if (formType === "multipart") {
    for (const step of formStructure) {
      // console.log({ step });

      // @ts-ignore
      for (const field of step?.fields) {
        // console.log({ field });

        if (field) {
          addFieldToContext({ field, context });
        }
      }
    }

    context.currentStep = 0;
  }

  if (formType === "basic") {
    for (const nestedField of formStructure) {
      if (typeof nestedField === "object") {
        // @ts-ignore
        addFieldToContext({ field: nestedField, context });
      }
    }
  }

  return context;
}

export { formLoaderFunction };
