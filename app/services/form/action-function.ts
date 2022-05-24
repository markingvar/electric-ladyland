import {
  checkContextForErrors,
  handleFormData,
  honeypotFieldHasValue,
} from "./action-utils";
import { FormFieldInput, MultiStepForm } from "./types";
import {
  commitSession,
  getSession,
  destroySession,
} from "~/services/form/session.server";
import { json, redirect } from "@remix-run/node";
import {
  addFormValuesToContext,
  validateFormFieldValue,
} from "~/services/form/action-utils";
import { getFormStage } from "./shared";

async function formActionFunction({
  formType,
  request,
  formBlueprint,
  handleDataFn,
  successRedirectPath,
}:
  | {
      formType: "basic";
      request: Request;
      formBlueprint: FormFieldInput[];
      handleDataFn: any;
      successRedirectPath: string;
    }
  | {
      formType: "multipart";
      request: Request;
      formBlueprint: MultiStepForm;
      handleDataFn: any;
      successRedirectPath: string;
    }): Promise<any> {
  // Get the current session
  const session = await getSession(request.headers.get("Cookie"));

  console.log({ session });

  let { pathname } = new URL(request.url);

  let context: any = session.get("context") ?? {};

  console.log({ context });

  // If there is no context, the session most likely timed out
  // We only really care about the context if it is a multipart form
  if (formType === "multipart" && Object.keys(context).length < 1) {
    let { pathname } = new URL(request.url);
    // console.log({ pathname });

    console.log("No context found in session, redirecting to start");
    return redirect(pathname, {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const body = await request.formData();

  // Handle bots by checking for honeypot field
  let honeypotFieldHit = honeypotFieldHasValue({ body });

  if (honeypotFieldHit) {
    return redirect("/");
  }

  const operationType = body.get("operation-type");

  // list item structure create/edit/delete ops
  if (operationType === "add-item-to-list") {
    let listItemObject: any = {};

    console.log({ currentStep: formBlueprint[context?.currentStep]?.fields });

    let expandableList = formBlueprint[context?.currentStep]?.fields.find(
      (item) => {
        return item.type === "expandable-list";
      }
    );
    console.log({ expandableList });

    let expandableListArr = context?.[expandableList.name]?.value ?? [];

    console.log({ expandableListArr });

    expandableList.listItemStructure.forEach((field: any) => {
      listItemObject[field.name] = {
        value: body.get(field.name),
        errors: [],
      };
    });

    expandableListArr.push(listItemObject);

    session.set("context", {
      ...context,
      [expandableList.name]: {
        value: expandableListArr,
        errors: [],
      },
    });

    return redirect(pathname, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else if (operationType === "edit-list-item") {
    let indexToChange = body.get("index-to-change");

    let expandableList = formBlueprint[context?.currentStep]?.fields.find(
      (item) => {
        return item.type === "expandable-list";
      }
    );
    let expandableListArr = context?.[expandableList.name]?.value ?? [];

    console.log({ expandableListArr });

    expandableList.listItemStructure.forEach((field: any) => {
      expandableListArr[Number(indexToChange)][field.name] = {
        value: body.get(field.name),
        errors: [],
      };
    });

    session.set("context", {
      ...context,
      [expandableList.name]: {
        value: expandableListArr,
        errors: [],
      },
    });

    return redirect(pathname, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else if (operationType === "delete-list-item") {
    let indexToDelete = body.get("index-to-delete");

    let expandableList = formBlueprint[context?.currentStep]?.fields.find(
      (item) => {
        return item.type === "expandable-list";
      }
    );
    let expandableListArr = context?.[expandableList.name]?.value ?? [];
    expandableListArr.splice(Number(indexToDelete), 1);

    session.set("context", {
      ...context,
      [expandableList.name]: {
        value: expandableListArr,
        errors: [],
      },
    });

    return redirect(pathname, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  let submitType: "back" | "next" | "submit" | string =
    body.get("submit-type")?.toString() ?? "";

  // console.log({ submitType });

  // Multipart - back button
  if (formType === "multipart") {
    if (submitType === "back") {
      context.currentStep -= 1;

      session.set("context", context);

      return redirect(pathname, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  // Add the form values to context
  await addFormValuesToContext({
    formType,
    formBlueprint,
    body,
    context,
  });

  // Validate the form inputs using the validation
  // methods from the form structure
  if (formType === "basic") {
    console.log("basically");

    formBlueprint.forEach((formField) => {
      validateFormFieldValue({ context, formField });
    });
  }

  if (formType === "multipart") {
    const currentFormStep = context.currentStep;

    for (const formField of formBlueprint[currentFormStep]?.fields) {
      // console.log({ formField });

      validateFormFieldValue({ context, formField });
    }
  }

  let sessionData: any = {};

  for (const contextItem in context) {
    // console.log({ contextItem: context[contextItem] });

    sessionData[contextItem] = context[contextItem].value;
  }

  // console.log({ sessionData });

  session.set("context", context);

  // Check for errors in context
  // In basic, we want to check all of the context entries
  // In multipart, we only want to check the context items
  // for the current step
  // @ts-expect-error function overload not externally visible
  let errorsInContext = checkContextForErrors({
    context,
    formType,
    formBlueprint,
  });

  // console.log({ errorsInContext, context });

  if (!errorsInContext) {
    // If there are no errors in the context we have two routes
    // to take

    // Basic Form
    // Multipart Form

    // BASIC FORM
    if (formType === "basic") {
      return handleFormData({
        request,
        handleDataFn,
        commitSession,
        context,
        successRedirectPath,
        session,
      });
    }

    // MULTIPART FORM

    // Get the current form stage
    // This will determine a couple things
    // * What buttons we need to render on the form
    // (Next, Back, Submit)
    // * If we are at the end, we want to handle the data,
    // otherwise we want to show the next step of the form
    const formStage = getFormStage({ formBlueprint, context });
    context.formStage = formStage;

    // Handle data
    if (formStage === "end" && submitType === "submit") {
      // console.log("hey guys");

      return handleFormData({
        handleDataFn,
        commitSession,
        context,
        successRedirectPath,
        session,
        request,
      });
    } else {
      console.log("pow");

      // console.log("whats up dawg?");
      // Still at the beginning or middle of the form
      // All the inputs were correct, we want to go to
      // the next stage of the form
      context.currentStep += 1;
      console.log({ currentStep: context.currentStep });

      session.set("context", context);

      return redirect(pathname, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  console.log("you're here?");

  return redirect(pathname, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export { formActionFunction };
