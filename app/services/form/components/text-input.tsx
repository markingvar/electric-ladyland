import { displayFieldLabelDescriptionError } from "./shared/display";
import type { TextFieldBlueprint } from "../types";
import { onChange, useFormField } from "./shared/logic";

export function TextInput({
  fieldBlueprint,
  fieldContext,
  className,
}: {
  fieldContext: { value?: string; errors: string[] };
  fieldBlueprint: TextFieldBlueprint;
  className?: string;
}) {
  let {
    defaultValue,
    fieldErrors,
    setFieldErrors,
    fieldVisited,
    setFieldVisited,
  } = useFormField({ fieldBlueprint, fieldContext });
  return (
    <>
      {displayFieldLabelDescriptionError({
        fieldBlueprint,
        fieldErrors,
        fieldVisited,
      })}
      {fieldBlueprint.type === "text" ||
      fieldBlueprint.type === "password" ||
      fieldBlueprint.type === "email" ? (
        <input
          data-test={fieldBlueprint.name}
          name={fieldBlueprint.name}
          id={fieldBlueprint.name}
          className={`bg-white  font-body font-medium rounded w-full text-base p-2 mm:text-xl${
            className ? " " + className : ""
          }`}
          required={fieldBlueprint.required}
          defaultValue={defaultValue}
          placeholder={fieldBlueprint.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={(event) => {
            onChange({
              e: event,
              setFieldErrors,
              fieldErrors,
              fieldValidation: fieldBlueprint.validation,
            });
          }}
          pattern={fieldBlueprint.validation.formInputPattern}
          title={fieldBlueprint.validation.formInputMessage}
          type={fieldBlueprint.type}
          autoCorrect="false"
          autoComplete="false"
        />
      ) : fieldBlueprint.type === "textarea" ? (
        <textarea
          name={fieldBlueprint.name}
          id={fieldBlueprint.name}
          data-test={fieldBlueprint.name}
          className="w-full font-medium mm:text-lg p-2 px-3 bg-white rounded"
          required={fieldBlueprint.required}
          rows={5}
          defaultValue={defaultValue}
          placeholder={fieldBlueprint.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={(event) => {
            onChange({
              e: event,
              setFieldErrors,
              fieldErrors,
              fieldValidation: fieldBlueprint.validation,
            });
          }}
        />
      ) : null}
    </>
  );
}
