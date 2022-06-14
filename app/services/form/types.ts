type AlignText = "left" | "right" | "center";

export type StatefulRadioFieldBlueprint = {
  type: "stateful-radio";
  name: string;
  testName?: string;
  description?: string;
  label: string;
  options: string[];
  initialValue: string;
  dependentChildren: (FormFieldInput | undefined)[][];
  showOnMobileTable?: boolean;
};

type HiddenFieldBlueprint = {
  type: "hidden";
  label?: string;
  name: string;
  initialValue: string;
};

export type RadioFieldBlueprint = {
  type: "radio";
  testName?: string;
  name: string;
  description?: string;
  label: string;
  options: string[];
  initialValue: string;
  showOnMobileTable?: boolean;
  tableFlex?: number;
  alignText?: AlignText;
};

export type CheckboxBlueprint = {
  testName?: string;
  type: "checkbox";
  name: string;
  label: string;
  value: string;
  initialValue?: string;
  showOnMobileTable?: boolean;
  tableFlex?: number;
  alignText?: AlignText;
};

export type CheckboxGroupBlueprint = {
  type: "checkbox-group";
  name: string;
  label: string;
  description?: string;
  checkboxes: CheckboxBlueprint[];
  showOnMobileTable?: boolean;
};

export type ExpandableListBlueprint = {
  type: "expandable-list";
  name: string;
  listLabel?: string;
  listDescription?: string;
  listItemStructure: FormBlueprint;
  initialValue: any[];
  addItemLabel: string;
  editItemLabel: string;
  addOrEditItemModalLabel: string;
};

export type TextFieldBlueprint = {
  testName?: string;
  type: "text" | "textarea" | "password" | "email";
  description?: string;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
  showOnMobileTable?: boolean;
  tableFlex?: number;
  alignText?: AlignText;
};

export type FormFieldInput =
  | StatefulRadioFieldBlueprint
  | RadioFieldBlueprint
  | TextFieldBlueprint
  | CheckboxBlueprint
  | HiddenFieldBlueprint
  | CheckboxGroupBlueprint
  | ExpandableListBlueprint;

export type FormBlueprint = FormFieldInput[];

export type Step = {
  fields: FormFieldInput[];
  nextButtonText?: string;
  backButtonText?: string;
};

export type MultiStepForm = Step[];
