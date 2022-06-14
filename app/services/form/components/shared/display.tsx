import type { ReactNode } from "react";
import type {
  CheckboxGroupBlueprint,
  RadioFieldBlueprint,
  StatefulRadioFieldBlueprint,
  TextFieldBlueprint,
} from "../../types";

export function FieldLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <span
        className={`block font-display font-bold text-xl tb:text-xl text-neutral-6${
          className ? " " + className : ""
        }`}
      >
        {children}
      </span>
      <span className="block h-1.5"></span>
    </>
  );
}

export function FieldDescription({ children }: { children: ReactNode }) {
  if (children) {
    return (
      <p className="-mt-1 mb-4 mm:mb-3 text-neutral-6 font-light">{children}</p>
    );
  }

  return null;
}

export function displayFieldErrors({
  fieldErrors,
  fieldVisited,
}: {
  fieldErrors: string[];
  fieldVisited: boolean;
}) {
  return (
    <div className="mb-1">
      {fieldErrors.length >= 1 && fieldVisited
        ? fieldErrors.map((fieldError) => {
            return (
              <div
                className="text-danger-6 font-medium mm:text-lg"
                key={fieldError}
              >
                {fieldError}
              </div>
            );
          })
        : null}
    </div>
  );
}

export function displayFieldLabelDescriptionError({
  fieldBlueprint,
  fieldErrors,
  fieldVisited,
}: {
  fieldBlueprint:
    | TextFieldBlueprint
    | RadioFieldBlueprint
    | StatefulRadioFieldBlueprint
    | CheckboxGroupBlueprint;
  fieldErrors?: string[];
  fieldVisited?: boolean;
}) {
  return (
    <>
      <label
        htmlFor={fieldBlueprint.name}
        className="block mb-12"
        key={fieldBlueprint.name}
      >
        <FieldLabel>{fieldBlueprint.label}</FieldLabel>
      </label>

      <FieldDescription>{fieldBlueprint.description}</FieldDescription>

      {fieldErrors && fieldVisited
        ? displayFieldErrors({ fieldErrors, fieldVisited })
        : null}
    </>
  );
}

export function RadioOrCheckboxWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  // console.log({ className });

  return (
    <>
      <div
        className={`mb-1 mt-2 flex items-center${
          className ? " " + className : ""
        }`}
      >
        {children}
      </div>
      <span className="block h-1"></span>
    </>
  );
}

export function RadioOrCheckboxLabel({
  className,
  children,
  htmlFor,
}: {
  className?: string;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`radio-label block ml-2 font-medium mm:text-lg mm:ml-3 text-neutral-8${
        className ? " " + className : ""
      }`}
    >
      {children}
    </label>
  );
}
