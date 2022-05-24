type AlignText = "left" | "right" | "center";

export type StatefulRadioField = {
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

type Hidden = {
  type: "hidden";
  label?: string;
  name: string;
  initialValue: string;
};

type RadioField = {
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

type Checkbox = {
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

type CheckboxGroup = {
  type: "checkbox-group";
  name: string;
  groupLabel: string;
  description?: string;
  checkboxes: Checkbox[];
  showOnMobileTable?: boolean;
};

export type ExpandableList = {
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

type TextField = {
  testName?: string;
  type: "text" | "textarea";
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

type PasswordField = {
  testName?: string;
  type: "password";
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

type EmailField = {
  testName?: string;
  type: "email";
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
  | StatefulRadioField
  | RadioField
  | TextField
  | PasswordField
  | EmailField
  | Checkbox
  | Hidden
  | CheckboxGroup
  | ExpandableList;

export type FormBlueprint = FormFieldInput[];

export type Step = {
  fields: FormFieldInput[];
  nextButtonText?: string;
  backButtonText?: string;
};

export type MultiStepForm = Step[];
