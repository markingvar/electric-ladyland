import type { RadioFieldBlueprint } from "../types";
import {
  displayFieldLabelDescriptionError,
  RadioOrCheckboxLabel,
  RadioOrCheckboxWrapper,
} from "./shared/display";
import { createFieldLabel } from "./shared/logic";

export function Radio({
  fieldBlueprint,
  fieldContext,
}: {
  fieldContext: { value?: string; errors: string[] };
  fieldBlueprint: RadioFieldBlueprint;
  className?: string;
}) {
  return (
    <>
      {displayFieldLabelDescriptionError({
        fieldBlueprint,
      })}

      {fieldBlueprint.options.map((radioValue) => {
        console.log({ radioValue });

        let defaultRadioValue = fieldBlueprint.initialValue;

        if (fieldContext?.value) {
          defaultRadioValue = fieldContext.value;
        }

        const label = createFieldLabel(radioValue);
        return (
          <RadioOrCheckboxWrapper key={`${fieldBlueprint.name}-${radioValue}`}>
            <input
              data-test={`${fieldBlueprint.name}-${radioValue}`}
              key={radioValue}
              type="radio"
              id={`${fieldBlueprint.name}-${radioValue}`}
              name={fieldBlueprint.name}
              value={radioValue}
              autoComplete="off"
              defaultChecked={radioValue === defaultRadioValue}
            />
            <RadioOrCheckboxLabel
              className="ml-2
              "
              htmlFor={`${fieldBlueprint.name}-${radioValue}`}
            >
              {label}
            </RadioOrCheckboxLabel>
          </RadioOrCheckboxWrapper>
        );
      })}
    </>
  );
}
