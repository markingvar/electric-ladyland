import { useState } from "react";
import { FormField } from "../form-field";
import type { StatefulRadioFieldBlueprint } from "../types";
import {
  displayFieldLabelDescriptionError,
  RadioOrCheckboxLabel,
  RadioOrCheckboxWrapper,
} from "./shared/display";
import { createFieldLabel } from "./shared/logic";

export function StatefulRadio({
  fieldBlueprint,
  context,
}: {
  fieldBlueprint: StatefulRadioFieldBlueprint;
  context: any;
}) {
  let selectedIndex = 0;
  fieldBlueprint.options.forEach((option, index) => {
    let defaultValue =
      context[fieldBlueprint.name]?.value ?? fieldBlueprint.initialValue;
    if (defaultValue === option) {
      selectedIndex = index;
    }
  });

  console.log({ context });

  const [selectedValue, setSelectedValue] = useState(selectedIndex);

  return (
    <>
      {displayFieldLabelDescriptionError({
        fieldBlueprint,
      })}
      {fieldBlueprint.options.map((radioValue, index) => {
        const label = createFieldLabel(radioValue);

        if (index === selectedValue) {
          return (
            <RadioOrCheckboxWrapper key={radioValue}>
              <input
                data-test={`${fieldBlueprint.name}-${radioValue}`}
                type="radio"
                id={`${fieldBlueprint.name}-${radioValue}`}
                name={fieldBlueprint.name}
                value={radioValue}
                onChange={() => {
                  setSelectedValue(index);
                }}
                checked={true}
                autoComplete="off"
              />
              <RadioOrCheckboxLabel
                htmlFor={`${fieldBlueprint.name}-${radioValue}`}
              >
                {label}
              </RadioOrCheckboxLabel>
            </RadioOrCheckboxWrapper>
          );
        } else {
          return (
            <RadioOrCheckboxWrapper key={radioValue}>
              <input
                data-test={`${fieldBlueprint.name}-${radioValue}`}
                type="radio"
                id={`${fieldBlueprint.name}-${radioValue}`}
                name={fieldBlueprint.name}
                value={radioValue}
                onChange={() => {
                  setSelectedValue(index);
                }}
                autoComplete="off"
              />
              <RadioOrCheckboxLabel
                htmlFor={`${fieldBlueprint.name}-${radioValue}`}
              >
                {label}
              </RadioOrCheckboxLabel>
            </RadioOrCheckboxWrapper>
          );
        }
      })}
      {fieldBlueprint.dependentChildren[selectedValue].map((nestedField) => {
        if (nestedField) {
          return (
            <FormField
              context={context}
              key={nestedField.name}
              field={nestedField}
            />
          );
        }
        return null;
      })}
    </>
  );
}
