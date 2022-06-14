import type { MultiStepForm, Step } from "~/services/form/types";
import { validation } from "~/services/form/validation";

const notImportantStep: Step = {
  fields: [
    {
      name: "not-important",
      label: "Not Important",
      type: "text",
      required: true,
      initialValue: "Anything here",
      validation: {
        patterns: ["^[\\w\\s-&']{2,50}$"],
        messages: ["letters, spaces, & or '"],
      },
    },
    {
      name: "is-commercial-client",
      label: "Commercial Client?",
      type: "stateful-radio",
      options: ["no", "yes", "maybe"],
      initialValue: "no",
      dependentChildren: [
        [undefined],
        [
          {
            name: "business-name",
            label: "Business Name",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
          {
            name: "business-address",
            label: "Business Address",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
        ],
        [
          {
            name: "business-name",
            label: "Business Name",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
          {
            name: "business-address",
            label: "Business Address",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
        ],
      ],
    },
    {
      name: "testy-test",
      type: "hidden",
      initialValue: "dags",
    },
  ],
  nextButtonText: "Todo List",
};

const todoStep: Step = {
  fields: [
    {
      name: "todo-items-list",
      type: "expandable-list",
      listLabel: "Todo Items",
      addItemLabel: "Add Item",
      editItemLabel: "Edit Item",
      addOrEditItemModalLabel: "Add or Edit Item",
      initialValue: [],
      listItemStructure: [
        {
          name: "todo-title",
          label: "Part #",
          type: "text",
          required: true,
          initialValue: "",
          validation: {
            patterns: ["^[\\w\\s-&']{2,50}$"],
            messages: ["letters, spaces, & or '"],
          },
          showOnMobileTable: true,
          tableFlex: 3,
          alignText: "left",
        },
        {
          name: "todo-description",
          label: "Description",
          description:
            "Short (less than 30 characters) description of todo item",
          type: "text",
          required: true,
          initialValue: "",
          validation: {
            patterns: ["^[\\w\\s-&']{2,30}$"],
            messages: ["letters, spaces, & or '"],
          },
          showOnMobileTable: true,
          tableFlex: 3,
          alignText: "left",
        },
        {
          name: "priority",
          label: "Source",
          type: "radio",
          options: ["High", "Medium", "Low"],
          initialValue: "High",
        },
      ],
    },
  ],
  backButtonText: "Not Important",
  nextButtonText: "Less Important",
};

const lessImportantStep: Step = {
  fields: [
    {
      name: "less-important",
      label: "Less Important",
      type: "text",
      required: true,
      initialValue: "Less important thing",
      validation: {
        patterns: ["^[\\w\\s-&']{2,50}$"],
        messages: ["letters, spaces, & or '"],
      },
    },
  ],
  backButtonText: "Todo List",
  nextButtonText: "Submit",
};

export const multiItemStepForm: MultiStepForm = [
  notImportantStep,
  todoStep,
  lessImportantStep,
];
