import type { CheckboxGroupBlueprint } from "../types";
import {
  displayFieldLabelDescriptionError,
  RadioOrCheckboxLabel,
  RadioOrCheckboxWrapper,
} from "./shared/display";

// Because we are dealing with checkboxes, we want all of the
// context items.

// To determine if a checkbox is checked, we need to look
// at the context to see if the field exists there. If it does,
// we know that the checkbox is checked.
export function CheckboxGroup({
  fieldBlueprint,
  context,
}: {
  context: any;
  fieldBlueprint: CheckboxGroupBlueprint;
  className?: string;
}) {
  return (
    <>
      {displayFieldLabelDescriptionError({
        fieldBlueprint,
      })}

      {fieldBlueprint.checkboxes.map((checkbox) => {
        return (
          <RadioOrCheckboxWrapper key={checkbox.name}>
            <input
              data-test={`${checkbox.name}-${checkbox.value}`}
              key={checkbox.name}
              type="checkbox"
              id={checkbox.name}
              name={checkbox.name}
              value={checkbox.value}
              autoComplete="off"
              defaultChecked={context?.[checkbox.name]}
            />
            <RadioOrCheckboxLabel
              className="ml-2
              "
              htmlFor={checkbox.name}
            >
              {checkbox.label}
            </RadioOrCheckboxLabel>
          </RadioOrCheckboxWrapper>
        );
      })}
    </>
  );
}
