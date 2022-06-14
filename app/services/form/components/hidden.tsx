// Create a component that renders a hidden input
export function HiddenField({
  fieldContext,
  fieldBlueprint,
}: {
  fieldContext: {
    value?: string;
  };
  fieldBlueprint: {
    initialValue?: string;
    name: string;
  };
}) {
  let initialValue = fieldBlueprint.initialValue ?? "";
  let value = fieldContext?.value ?? initialValue;
  return <input type="hidden" name={fieldBlueprint.name} value={value} />;
}
