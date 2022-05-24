import type { FormFieldInput, MultiStepForm } from "~/services/form/types";
import {
  getSession,
  commitSession,
  destroySession,
} from "~/services/form/session.server";
import { json } from "@remix-run/node";
import { addFieldToContext, checkForFieldNameAndValue } from "./loader-utils";
import { getFormStage } from "./shared";

async function formLoaderFunction({
  basicOrMultipart,
  request,
  formBlueprint,
}:
  | {
      basicOrMultipart: "multipart";
      request: Request;
      formBlueprint: MultiStepForm;
    }
  | {
      basicOrMultipart: "basic";
      request: Request;
      formBlueprint: FormFieldInput[];
    }): Promise<any> {
  // Get current session
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  console.log("here's your context", context);

  // Check to see if the current context matches the current
  // form structure. If it doesn't match, there is a good chance
  // that there is no context or we are coming from a different form
  context = checkExistingContext({ formBlueprint, basicOrMultipart, context });

  // If the context object doesn't have any length, we
  // know that it is empty and we need to seed it
  if (Object.keys(context).length < 1) {
    context = seedContextWithInitialValues({ formBlueprint, basicOrMultipart });
  }

  console.log("here's your context now", context);

  // Get the current step
  context?.currentStep ?? 0;

  // We should never have a negative number
  // for the current step
  if (context.currentStep < 0) {
    context.currentStep = 0;
  }

  if (basicOrMultipart === "multipart") {
    let formStage = getFormStage({ context, formBlueprint });

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
    context.nextButtonText = formBlueprint[context.currentStep]?.nextButtonText;
    // @ts-ignore
    context.backButtonText = formBlueprint[context.currentStep]?.backButtonText;
  }

  session.set("context", context);

  if (basicOrMultipart === "multipart") {
    console.log({ currentStep: context?.currentStep });

    return {
      context,
      currentStepBlueprint: formBlueprint[context.currentStep]?.fields,
      commitSession,
      session,
      commitSessionFn: async () => {
        await commitSession(session);
      },
    };
  } else {
    return {
      context,
      currentStepBlueprint: formBlueprint,
      commitSession,
      session,
      commitSessionFn: async () => {
        await commitSession(session);
      },
    };
    // return json(
    //   { context, formBlueprint },
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
  basicOrMultipart,
  formBlueprint,
  context,
}:
  | {
      basicOrMultipart: "basic";
      formBlueprint: FormFieldInput[];
      context: any;
    }
  | {
      basicOrMultipart: "multipart";
      formBlueprint: MultiStepForm;
      context: any;
    }): any {
  // If context does not exist, return early. We will need to
  // seed the context with initial values
  if (!context) {
    // console.log("No Existing Context");

    return false;
  }

  let incorrectContext = false;

  if (basicOrMultipart === "multipart") {
    for (const step of formBlueprint) {
      // @ts-ignore
      for (const field of step?.fields) {
        if (incorrectContext) {
          console.log("haro!");

          return {};
        }

        incorrectContext = checkForFieldNameAndValue({ field, context });
      }
    }
  }

  if (basicOrMultipart === "basic") {
    // @ts-ignore
    for (const field of formBlueprint) {
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
  basicOrMultipart,
  formBlueprint,
}: {
  basicOrMultipart: "multipart";
  formBlueprint: MultiStepForm;
}): any;
function seedContextWithInitialValues({
  basicOrMultipart,
  formBlueprint,
}: {
  basicOrMultipart: "basic";
  formBlueprint: FormFieldInput[];
}): any;
function seedContextWithInitialValues({
  basicOrMultipart,
  formBlueprint,
}: {
  basicOrMultipart: "multipart" | "basic";
  formBlueprint: MultiStepForm | FormFieldInput[];
}): any {
  // Give the context object initial values
  let context: any = {};

  if (basicOrMultipart === "multipart") {
    for (const step of formBlueprint) {
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

  if (basicOrMultipart === "basic") {
    for (const nestedField of formBlueprint) {
      if (typeof nestedField === "object") {
        // @ts-ignore
        addFieldToContext({ field: nestedField, context });
      }
    }
  }

  return context;
}

export { formLoaderFunction };
