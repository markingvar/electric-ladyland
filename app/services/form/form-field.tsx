import type { FormFieldInput } from "~/services/form/types";
// import styles from "~/styles/form.css";
import { HiddenField } from "./components/hidden";
import { TextInput } from "./components/text-input";
import { Radio } from "./components/radio";
import { CheckboxGroup } from "./components/checkbox-group";
import { ExpandableList } from "./components/expandable-list";
import { StatefulRadio } from "./components/stateful-radio";

// FormField.styles = styles;

// eslint-disable-next-line complexity
export function FormField({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  if (field.type === "hidden") {
    return (
      <HiddenField fieldContext={context[field.name]} fieldBlueprint={field} />
    );
  }

  if (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "password" ||
    field.type === "email"
  ) {
    return (
      <TextInput fieldBlueprint={field} fieldContext={context[field.name]} />
    );
  }

  if (field.type === "radio") {
    return <Radio fieldBlueprint={field} fieldContext={context[field.name]} />;
  }

  if (field.type === "checkbox-group") {
    return <CheckboxGroup fieldBlueprint={field} context={context} />;
  }

  if (field.type === "expandable-list") {
    return (
      <ExpandableList
        fieldBlueprint={field}
        fieldContext={context[field.name]}
      />
    );
  }

  if (field.type === "stateful-radio") {
    return <StatefulRadio fieldBlueprint={field} context={context} />;
  }
  return null;
}
