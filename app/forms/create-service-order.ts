import { MultiStepForm, Step } from "~/services/form/types";

let selectDayStep: Step = {
  fields: [
    {
      type: "hidden",
      initialValue: "",
      name: "selected-day",
    },
  ],
  nextButtonText: "Next",
};

let technicianOptionsStep: Step = {
  fields: [
    // {
    // }
  ],
};
