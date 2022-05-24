import type { Step, MultiStepForm } from "~/services/form/types";
import { validation } from "~/services/form/validation";

const clientDetailsStep: Step = {
  fields: [
    {
      name: "client-name",
      label: "Client Name",
      type: "text",
      required: true,
      initialValue: "",
      validation: {
        patterns: ["^[\\w\\s-&']{2,50}$"],
        messages: ["letters, spaces, & or '"],
      },
    },
    {
      name: "phone-number",
      label: "Phone Number",
      type: "text",
      required: true,
      initialValue: "",
      validation: {
        patterns: [validation.phoneNumber.pattern],
        messages: [validation.phoneNumber.message],
      },
    },
    {
      name: "is-commercial-client",
      label: "Commercial Client?",
      type: "stateful-radio",
      options: ["no", "yes"],
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
        ],
      ],
    },
    {
      name: "client-is-site-contact",
      label: "Client Is Site Contact?",
      type: "stateful-radio",
      options: ["yes", "no"],
      initialValue: "yes",
      dependentChildren: [
        [undefined],
        [
          {
            name: "site-contact-name",
            label: "Site Contact Name",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
          {
            name: "site-contact-phone-number",
            label: "Site Contact Phone",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: [validation.phoneNumber.pattern],
              messages: [validation.phoneNumber.message],
            },
          },
        ],
      ],
    },
  ],
  nextButtonText: "Job Address",
};

let addressStep: Step = {
  fields: [
    {
      name: "job-address",
      label: "Job Address",
      type: "text",
      required: true,
      initialValue: "",
      validation: {
        patterns: ["^[\\w\\s&']{2,50}$"],
        messages: ["letters, spaces, & or '"],
      },
    },
    {
      name: "job-city",
      label: "City",
      type: "stateful-radio",
      options: ["fort-st-john", "other"],
      initialValue: "fort-st-john",
      dependentChildren: [
        [undefined],
        [
          {
            name: "other-city",
            label: "Specify City",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: ["^[\\w\\s.&']{2,50}$"],
              messages: ["letters, spaces, & or '"],
            },
          },
        ],
      ],
    },
  ],
  backButtonText: "Client Details",
  nextButtonText: "Call Type",
};

let billingInfoStep: Step = {
  fields: [
    {
      name: "invoice-method",
      label: "How To Invoice Client?",
      type: "stateful-radio",
      options: ["text", "email", "mail"],
      initialValue: "text",
      dependentChildren: [
        [
          {
            name: "phone-number-for-billing",
            label: "Phone Number To Use",
            description:
              "We can use the number that the client has already provided or get a different one if they prefer.",
            type: "stateful-radio",
            options: ["client-phone", "other"],
            initialValue: "text",
            dependentChildren: [
              [undefined],
              [
                {
                  name: "other-billing-phone-number",
                  label: "Other Number to Use",
                  type: "text",
                  required: true,
                  initialValue: "",
                  validation: {
                    patterns: [validation.phoneNumber.pattern],
                    messages: [validation.phoneNumber.message],
                  },
                },
              ],
              [undefined],
            ],
          },
        ],
        [
          {
            name: "email-address-for-billing",
            label: "Email Address",
            type: "email",
            required: true,
            initialValue: "",
            validation: {
              patterns: [validation.emailAddress.pattern],
              messages: [validation.emailAddress.message],
            },
          },
        ],
        [
          {
            name: "mailing-address-for-billing",
            label: "Mailing Address",
            description:
              "We can use the job address or a different one if the client has a different billing address",
            type: "stateful-radio",
            options: ["use-job-address", "other"],
            initialValue: "text",
            dependentChildren: [
              [undefined],
              [
                {
                  name: "billing-address",
                  label: "Billing Address",
                  type: "text",
                  required: true,
                  initialValue: "",
                  validation: {
                    patterns: ["^[\\w\\s&']{2,50}$"],
                    messages: ["letters, spaces, & or '"],
                  },
                },
                {
                  name: "city-to-use-for-billing",
                  label: "Billing City",
                  type: "stateful-radio",
                  options: ["fort-st-john", "other"],
                  initialValue: "fort-st-john",
                  dependentChildren: [
                    [undefined],
                    [
                      {
                        name: "billing-city",
                        label: "Billing City",
                        type: "text",
                        required: true,
                        initialValue: "",
                        validation: {
                          patterns: ["^[\\w\\s&.']{2,50}$"],
                          messages: ["letters, spaces, & or '"],
                        },
                      },
                    ],
                  ],
                },
              ],
              [undefined],
            ],
          },
          {
            name: "postal-code",
            label: "Postal Code",
            type: "text",
            required: true,
            initialValue: "",
            validation: {
              patterns: [validation.postalCode.pattern],
              messages: [validation.postalCode.message],
            },
          },
        ],
      ],
    },
  ],
  backButtonText: "Job Address",
  nextButtonText: "Work Descrip",
};

const workPerformedStep: Step = {
  fields: [
    {
      name: "work-performed",
      label: "Work Performed",
      type: "textarea",
      required: true,
      initialValue: "",
      validation: {
        patterns: ["^[\\w\\s&']{2,500}$"],
        messages: ["letters, spaces, & or '"],
      },
    },
    {
      name: "job-is-complete",
      label: "Job Complete?",
      type: "stateful-radio",
      options: ["yes", "no"],
      initialValue: "yes",
      dependentChildren: [
        [undefined],
        [
          {
            name: "job-not-complete-reason",
            label: "Job Not Complete Reason",
            type: "stateful-radio",
            options: ["awaiting-parts", "awaiting-labor", "other"],
            initialValue: "awaiting-parts",
            dependentChildren: [
              [undefined],
              [undefined],
              [
                {
                  name: "other-job-not-complete-reason",
                  label: "Other Reason",
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
        ],
      ],
    },
  ],
  backButtonText: "Billing Info",
  nextButtonText: "Parts Used",
};

const partsUsedStep: Step = {
  fields: [
    {
      name: "parts-used",
      type: "expandable-list",
      listLabel: "Parts Used",
      addItemLabel: "Add Part",
      editItemLabel: "Edit Part",
      addOrEditItemModalLabel: "Add or Edit Part",
      initialValue: [],
      listItemStructure: [
        {
          name: "part-number",
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
          name: "part-description",
          label: "Description",
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
          name: "part-source",
          label: "Source",
          type: "radio",
          options: ["ISC", "RSL", "HH", "PRO", "EMCO", "LNX", "SHOP"],
          initialValue: "SHOP",
        },
        {
          name: "part-quantity",
          label: "Qty",
          type: "text",
          required: true,
          initialValue: "",
          validation: {
            patterns: ["^[\\d]{1,3}$"],
            messages: ["use numbers only"],
          },
          showOnMobileTable: true,
          tableFlex: 1,
          alignText: "right",
        },
        {
          name: "part-left-on-site",
          label: "Status",
          type: "radio",
          options: ["installed", "left-on-site"],
          initialValue: "installed",
        },
      ],
    },
  ],
  backButtonText: "Work Performed",
  nextButtonText: "Shop Supplies",
};

const shopSuppliesStep: Step = {
  fields: [
    {
      name: "shop-supplies-used",
      type: "expandable-list",
      listLabel: "Shop Supplies",
      addItemLabel: "Add Item",
      editItemLabel: "Edit Item",
      addOrEditItemModalLabel: "Add or Edit Item",
      initialValue: [],
      listItemStructure: [
        {
          name: "shop-supply-type",
          label: "Supply Type",
          type: "radio",
          options: [
            "acetylene",
            "silfos",
            "vac pump",
            "recovery unit",
            "nitrogen",
          ],
          initialValue: "acetylene",
          showOnMobileTable: true,
          tableFlex: 3,
          alignText: "left",
        },
        {
          name: "part-quantity",
          label: "Qty",
          type: "text",
          required: true,
          initialValue: "",
          validation: {
            patterns: ["^[\\d]{1,3}$"],
            messages: ["use numbers only"],
          },
          showOnMobileTable: true,
          tableFlex: 1,
          alignText: "right",
        },
      ],
    },
  ],
  backButtonText: "Parts Used",
  nextButtonText: "Job Complete",
};

export const addServiceCallForm: MultiStepForm = [
  clientDetailsStep,
  addressStep,
  billingInfoStep,
  shopSuppliesStep,
  partsUsedStep,
  workPerformedStep,
];
