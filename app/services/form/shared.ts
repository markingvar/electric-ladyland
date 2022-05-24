import { MultiStepForm } from "~/services/form/types";

export function getFormStage({
  context,
  formBlueprint,
}: {
  context: any;
  formBlueprint: MultiStepForm;
}): "beginning" | "middle" | "end" {
  // What stage of the form are we in
  // Beginning - Middle - End
  const numberOfAvailableSteps = formBlueprint.length;
  let formStage: "beginning" | "middle" | "end" =
    context.currentStep === 0
      ? "beginning"
      : Number(context.currentStep) + 1 === numberOfAvailableSteps
      ? "end"
      : "middle";

  return formStage;
}

export function toBinary(string: string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

export function fromBinary(binary: string) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const charCodes = new Uint16Array(bytes.buffer);
  let result = "";
  for (let i = 0; i < charCodes.length; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

export function convertSingleQuotes(string: string) {
  let stringLength = string.length;
  let result = "";

  for (let i = 0; i < stringLength; i++) {
    // look for single quotes
    let stringChar = string.charCodeAt(i);

    // console.log({ stringChar });

    if (stringChar === 8216 || stringChar === 8217) {
      // console.log("We've got a runner");

      result += "'";
    } else {
      result += string[i];
    }
  }

  // console.log({ result });

  return result;
}
