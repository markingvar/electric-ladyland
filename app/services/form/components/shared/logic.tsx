import type { FormEvent } from "react";
import { useState } from "react";
import { convertSingleQuotes } from "../../shared";

export function createFieldLabel(fieldName: string) {
  let words = fieldName.split("-");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

export function onChange({
  e,
  fieldValidation,
  setFieldErrors,
  fieldErrors,
}: {
  e: FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>;
  setFieldErrors: any;
  fieldErrors: string[];
  fieldValidation: { patterns: string[]; messages: string[] };
}) {
  fieldValidation.patterns.forEach(async (pattern, index) => {
    let regexTestPattern = new RegExp(pattern, "gim");

    let value = convertSingleQuotes(e?.currentTarget?.value);

    let fieldIsValid = regexTestPattern.test(value);

    if (fieldIsValid) {
      setFieldErrors([]);
    } else if (!fieldErrors.includes(fieldValidation.messages[index])) {
      // console.log("not valid");

      // Only display the error message once
      setFieldErrors([...fieldErrors, fieldValidation.messages[index]]);
    }
  });
}

export function useFormField({
  fieldBlueprint,
  fieldContext,
}: {
  fieldBlueprint: {
    name: string;
    type: string;
    initialValue?: string;
  };
  fieldContext: {
    value?: string;
    errors: string[];
  };
}) {
  // Determine if the field has errors or has been visited
  let errors: string[] = [];
  let visited = false;

  if (
    fieldBlueprint.type === "email" ||
    fieldBlueprint.type === "password" ||
    fieldBlueprint.type === "text" ||
    fieldBlueprint.type === "textarea"
  ) {
    if (fieldContext?.errors) {
      errors = fieldContext?.errors;

      if (fieldContext?.errors.length >= 1) visited = true;
    }
  }

  let [fieldErrors, setFieldErrors] = useState(errors);
  let [fieldVisited, setFieldVisited] = useState(visited);

  // Check to see whether a value for the field exists in the context
  // If it does, set the value to the context value
  // If it doesn't, set the value to the initial value
  let initialValue = fieldBlueprint.initialValue ?? "";
  let defaultValue = fieldContext?.value ?? initialValue;

  return {
    fieldErrors,
    fieldVisited,
    setFieldErrors,
    setFieldVisited,
    defaultValue,
  };
}
