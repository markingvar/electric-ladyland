import { ReactNode, useEffect, useState } from "react";
import type {
  ExpandableList,
  FormFieldInput,
  FormBlueprint,
  StatefulRadioField,
} from "~/services/form/types";
// import styles from "~/styles/form.css";
import { convertSingleQuotes } from "~/services/form/shared";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { Form, useSubmit } from "@remix-run/react";
import { FiPlusCircle } from "react-icons/fi";

function createFieldLabel(fieldName: string) {
  let words = fieldName.split("-");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

function displayFieldErrors({
  fieldErrors,
  fieldVisited,
}: {
  fieldErrors: string[];
  fieldVisited: boolean;
}) {
  return (
    <div className="mb-1">
      {fieldErrors.length >= 1 && fieldVisited
        ? fieldErrors.map((fieldError) => {
            return (
              <div
                className="text-danger-6 font-medium mm:text-lg"
                key={fieldError}
              >
                {fieldError}
              </div>
            );
          })
        : null}
    </div>
  );
}

// FormField.styles = styles;

// eslint-disable-next-line complexity
export function FormField({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  let errors: string[] = [];
  let visited = false;

  // console.log({ field });

  if (
    field.type === "email" ||
    field.type === "password" ||
    field.type === "text" ||
    field.type === "textarea"
  ) {
    if (context[`${field.name}`]?.errors) {
      errors = context[`${field.name}`]?.errors;

      if (context[`${field.name}`]?.errors.length >= 1) visited = true;
    }
  }

  let [fieldErrors, setFieldErrors] = useState(errors);
  let [fieldVisited, setFieldVisited] = useState(visited);

  // console.log({ fieldVisited, fieldErrors });

  // On change does validation checks when the input field changes
  function onChange(e: any) {
    // Is it a text field
    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "email" ||
      field.type === "password"
    ) {
      field.validation.patterns.forEach(async (pattern: any, index: number) => {
        let regexTestPattern = new RegExp(pattern, "gim");

        let value = convertSingleQuotes(e.target.value);

        let fieldIsValid = regexTestPattern.test(value);

        // console.log({ fieldIsValid });

        if (fieldIsValid) {
          setFieldErrors([]);
        } else if (!fieldErrors.includes(field.validation.messages[index])) {
          // console.log("not valid");

          // Only display the error message once
          setFieldErrors([...fieldErrors, field.validation.messages[index]]);
        }
      });
    }
  }

  // console.log({ fieldErrors, fieldVisited });
  if (field.type === "hidden") {
    let value: string = field.initialValue;

    if (context[`${field.name}`]) {
      value = context[`${field.name}`]?.value;
    }

    return <input type="hidden" name={field.name} value={value} />;
  }

  if (field.type === "text") {
    let defaultValue = field.initialValue;

    if (context[`${field.name}`]) {
      defaultValue = context[`${field.name}`]?.value;
    }

    // console.log({ defaultValue });

    return (
      <label className="block mb-12" key={field.name}>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <InputField
          dataTest={field.name}
          required={field.required}
          name={field.name}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation.formInputPattern}
          title={field.validation.formInputMessage}
          type={field.type}
        />
      </label>
    );
  }

  if (field.type === "password") {
    let value = field.initialValue;

    if (context[`${field.name}`]) {
      value = context[`${field.name}`]?.value;
    }

    // console.log({ value });

    return (
      <label className="mb-6 block" key={field.name}>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <InputField
          dataTest={field.name}
          required={field.required}
          name={field.name}
          defaultValue={value}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation.formInputPattern}
          title={field.validation.formInputMessage}
          type="password"
        />
      </label>
    );
  }

  if (field.type === "email") {
    let defaultValue = field.initialValue;

    if (context[`${field.name}`]) {
      defaultValue = context[`${field.name}`]?.value;
    }

    return (
      <label className="mb-4" key={field.name}>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <InputField
          dataTest={field.name}
          required={field.required}
          name={field.name}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation.formInputPattern}
          title={field.validation.formInputMessage}
          type={field.type}
        />
      </label>
    );
  }

  if (field.type === "textarea") {
    let defaultValue = field.initialValue;

    if (context[field.name]) {
      defaultValue = context[field.name]?.value;
    }

    return (
      <label className="mb-4" key={field.name}>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <textarea
          data-test={field.name}
          className="w-full font-medium mm:text-lg p-2 px-3 bg-white rounded"
          required={field.required}
          rows={5}
          name={field.name}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
        />
        <span className="block h-10"></span>
      </label>
    );
  }

  if (field.type === "radio") {
    console.log({ context });

    return (
      <FieldItemWrapper>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {field.options.map((radioValue) => {
          console.log({ radioValue });

          let defaultRadioValue = field.initialValue;

          if (context[field.name]) {
            defaultRadioValue = context[field.name]?.value;
          }

          const label = createFieldLabel(radioValue);
          return (
            <RadioItem key={`${field.name}-${radioValue}`}>
              <input
                data-test={`${field.name}-${radioValue}`}
                key={radioValue}
                type="radio"
                id={`${field.name}-${radioValue}`}
                name={field.name}
                value={radioValue}
                autoComplete="off"
                defaultChecked={radioValue === defaultRadioValue}
              />
              <RadioLabel
                className="ml-2
              "
                htmlFor={`${field.name}-${radioValue}`}
              >
                {label}
              </RadioLabel>
            </RadioItem>
          );
        })}
      </FieldItemWrapper>
    );
  }

  if (field.type === "checkbox-group") {
    return (
      <FieldItemWrapper>
        <FieldLabel>{field.groupLabel}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {field.checkboxes.map((checkbox) => {
          return (
            <RadioItem key={checkbox.name}>
              <input
                data-test={`${checkbox.name}-${checkbox.value}`}
                key={checkbox.name}
                type="checkbox"
                id={checkbox.name}
                name={checkbox.name}
                value={checkbox.value}
                autoComplete="off"
                defaultChecked={context[checkbox.name]}
              />
              <RadioLabel
                className="ml-2
              "
                htmlFor={checkbox.name}
              >
                {checkbox.label}
              </RadioLabel>
            </RadioItem>
          );
        })}
        <span className="block h-4"></span>
      </FieldItemWrapper>
    );
  }

  if (field.type === "expandable-list") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { ExpandableList } = useExpandableList({
      field,
    });
    return (
      <>
        <FieldItemWrapper>
          <div className="expandable-list-label">{field.listLabel}</div>
          {field?.listDescription && (
            <>
              <span className="block h-2"></span>
              <FieldDescription>{field.listDescription}</FieldDescription>
            </>
          )}
          <span className="block h-8"></span>
          <ExpandableList context={context} />
        </FieldItemWrapper>
      </>
    );
  }

  if (field.type === "stateful-radio") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { StatefulRadio, selectedValue } = useStatefulRadio({
      field,
      context,
    });

    return (
      <FieldItemWrapper>
        <StatefulRadio key={field.name} />
        {selectedValue === 0
          ? field.dependentChildren[0].map((nestedField) => {
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
            })
          : selectedValue === 1
          ? field.dependentChildren[1].map((nestedField) => {
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
            })
          : selectedValue === 2
          ? field.dependentChildren[2].map((nestedField) => {
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
            })
          : selectedValue === 3
          ? field.dependentChildren[3].map((nestedField) => {
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
            })
          : []}
      </FieldItemWrapper>
    );
  }
  return null;
}

function useExpandableList({ field }: { field: ExpandableList }) {
  const submit = useSubmit();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [selectedAction, setSelectedAction] = useState("");
  const [listItems, setListItems] = useState([]);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  console.log({ field });

  let { listItemStructure } = field;

  function ExpandableList({ context }: { context: any }) {
    console.log({ context, fieldName: field.name });

    useEffect(() => {
      console.log("context changed");

      setListItems(context[field.name]?.value);
      console.log({ listItems });
    }, [context]);

    let fieldsToShowInTable = {};
    listItemStructure.map((field) => {
      // @ts-expect-error lolz typescript
      if (field.showOnMobileTable) {
        // @ts-expect-error lolz typescript
        fieldsToShowInTable[field.name] = field;
      }
    });

    return (
      <>
        <button
          className="add-item-button expand-click-target"
          onClick={() => {
            setSelectedIndex(undefined);
            setSelectedAction("");
            open();
          }}
        >
          <span className="add-item-icon">
            <FiPlusCircle />
          </span>
          {field.addItemLabel}
        </button>

        <span className="block h-5 mm:h-6"></span>

        {listItems.length > 0 && (
          <>
            <div className="list-items-table-wrapper">
              <table>
                <thead>
                  <tr className="lit-row">
                    {listItemStructure.map((nestedField) => {
                      if (
                        Object.keys(fieldsToShowInTable).includes(
                          nestedField.name
                        )
                      ) {
                        return (
                          <th
                            className="lit-cell"
                            data-flex={
                              // @ts-expect-error lolz typescript
                              nestedField.tableFlex
                            }
                            data-align-text={
                              // @ts-expect-error lolz typescript
                              nestedField.alignText
                            }
                            key={nestedField.name}
                          >
                            {
                              // @ts-expect-error lolz typescript
                              nestedField.label
                            }
                          </th>
                        );
                      }
                    })}
                    <th className="lit-cell" data-flex={3}>
                      &nbsp;
                    </th>
                    <th className="lit-cell" data-flex={3}>
                      &nbsp;
                    </th>
                  </tr>
                </thead>

                {listItems.map((item: any, index: number) => {
                  // console.log({ item });
                  return (
                    <tr className="lit-row" key={index}>
                      {Object.keys(fieldsToShowInTable).map(
                        (fieldToShow, index) => {
                          console.log({ index });

                          console.log(
                            "data-flex: ",
                            listItemStructure[index]?.tableFlex
                          );

                          let cellFlexValue;

                          let alignTextValue;

                          listItemStructure.forEach((itemStructure: any) => {
                            if (itemStructure.name === fieldToShow) {
                              cellFlexValue = itemStructure.tableFlex;
                              alignTextValue = itemStructure.alignText;
                            }
                          });

                          // flexValueArray.filter((item) => {
                          //   if (item !== undefined && typeof item === "number") {
                          //     return item;
                          //   }
                          // });

                          console.log({ cellFlexValue });

                          return (
                            <th
                              className="lit-cell"
                              data-flex={cellFlexValue}
                              data-align-text={alignTextValue}
                              key={`${item[fieldToShow]}-${index}`}
                            >
                              {item[fieldToShow]?.value}
                            </th>
                          );
                        }
                      )}
                      <th
                        className="lit-cell"
                        data-align-text="right"
                        data-flex={3}
                      >
                        <button
                          className="edit-item-button expand-click-target"
                          data-test={`edit-${index}`}
                          onClick={() => {
                            // @ts-expect-error lolz typescript
                            setSelectedIndex(index);
                            setSelectedAction("edit-item");

                            open();
                          }}
                        >
                          Edit
                        </button>
                      </th>
                      <th
                        className="lit-cell"
                        data-align-text="right"
                        data-flex={3}
                      >
                        <button
                          className="delete-item-button expand-click-target"
                          data-test={`delete-${index}`}
                          onClick={() => {
                            // @ts-expect-error lolz typescript
                            setSelectedIndex(index);
                            setSelectedAction("delete-item");

                            open();
                          }}
                        >
                          Delete
                        </button>
                      </th>
                    </tr>
                  );
                })}
              </table>
            </div>
          </>
        )}
        <DialogOverlay isOpen={showDialog} onDismiss={close}>
          <DialogContent aria-label={field.addOrEditItemModalLabel}>
            {selectedAction === "delete-item" ? (
              <>
                <div className="font-bold text-2xl text-danger-7">
                  Delete Item
                </div>
                <span className="block h-3"></span>
                <p>
                  Are you sure you want to delete item{" "}
                  {listItems.map((item, index) => {
                    if (index === selectedIndex) {
                      console.log({ item: item[Object.keys(item)[0]] });
                      return listItems[selectedIndex][
                        Object.keys(listItems[selectedIndex])[0]
                      ]?.value;
                    }
                  })}
                </p>
                <span className="block h-6"></span>
                <div className="flex items-center">
                  <button
                    className="bg-primary-05 text-primary-7 font-bold py-2 px-4 rounded-md mr-8 border-none expand-click-target"
                    data-test="cancel"
                    onClick={() => {
                      close();
                    }}
                  >
                    Cancel
                  </button>
                  <Form
                    method="post"
                    onSubmitCapture={(event) => {
                      submit(event.currentTarget);
                      close();
                    }}
                  >
                    <input
                      type="hidden"
                      name="operation-type"
                      value="delete-list-item"
                    />
                    <input
                      type="hidden"
                      name="index-to-delete"
                      value={selectedIndex}
                    />
                    <button
                      className="bg-danger-05 text-danger-9 font-bold outline-none py-2 px-4 rounded-md"
                      data-test="confirm-delete"
                      type="submit"
                    >
                      Confirm Delete
                    </button>
                  </Form>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-neutral-9 text-2xl">
                  {typeof selectedIndex === "number"
                    ? field.editItemLabel
                    : field.addItemLabel}
                </div>
                <span className="block h-8"></span>
                <Form
                  reloadDocument
                  method="post"
                  onSubmitCapture={(event) => {
                    submit(event.currentTarget);
                    close();
                  }}
                >
                  {selectedAction === "edit-item" ? (
                    <>
                      <input
                        type="hidden"
                        name="operation-type"
                        value="edit-list-item"
                      />
                      <input
                        type="hidden"
                        name="index-to-change"
                        value={selectedIndex}
                      />
                    </>
                  ) : (
                    <input
                      type="hidden"
                      name="operation-type"
                      value="add-item-to-list"
                    />
                  )}
                  {listItemStructure.map((nestedField) => {
                    return (
                      <FormField
                        context={
                          typeof selectedIndex === "number"
                            ? context[field.name]?.value[selectedIndex]
                            : context
                        }
                        key={nestedField.name}
                        field={nestedField}
                      />
                    );
                  })}
                  <span className="block h-4"></span>
                  <button
                    className="text-success-7 font-bold rounded-md border-none text-lg px-4 py-2 -ml-1 bg-success-05"
                    type="submit"
                  >
                    Confirm
                  </button>
                </Form>
              </>
            )}
          </DialogContent>
        </DialogOverlay>
      </>
    );
  }

  return { ExpandableList };
}

function useStatefulRadio({
  field,
  context,
}: {
  field: StatefulRadioField;
  context: any;
}) {
  let selectedIndex = 0;
  field.options.forEach((option, index) => {
    let defaultValue = field.initialValue;
    if (context[field.name]) {
      defaultValue = context[`${field.name}`].value;
    }
    if (defaultValue === option) {
      selectedIndex = index;
    }
  });

  const [selectedValue, setSelectedValue] = useState(selectedIndex);

  function StatefulRadio() {
    return (
      <FieldItemWrapper>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>{field.description}</FieldDescription>

        {field.options.map((radioValue, index) => {
          const label = createFieldLabel(radioValue);

          if (index === selectedValue) {
            return (
              <RadioItem key={radioValue}>
                <input
                  data-test={`${field.name}-${radioValue}`}
                  type="radio"
                  id={`${field.name}-${radioValue}`}
                  name={field.name}
                  value={radioValue}
                  onChange={() => {
                    setSelectedValue(index);
                  }}
                  checked={true}
                  autoComplete="off"
                />
                <RadioLabel htmlFor={`${field.name}-${radioValue}`}>
                  {label}
                </RadioLabel>
              </RadioItem>
            );
          } else {
            return (
              <RadioItem key={radioValue}>
                <input
                  data-test={`${field.name}-${radioValue}`}
                  type="radio"
                  id={`${field.name}-${radioValue}`}
                  name={field.name}
                  value={radioValue}
                  onChange={() => {
                    setSelectedValue(index);
                  }}
                  autoComplete="off"
                />
                <RadioLabel htmlFor={`${field.name}-${radioValue}`}>
                  {label}
                </RadioLabel>
              </RadioItem>
            );
          }
        })}
      </FieldItemWrapper>
    );
  }
  return { StatefulRadio, selectedValue };
}

function FieldItemWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mb-10${className ? " " + className : ""}`}>{children}</div>
  );
}

function FieldLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <span
        className={`block font-display font-bold text-xl tb:text-xl text-neutral-6${
          className ? " " + className : ""
        }`}
      >
        {children}
      </span>
      <span className="block h-1.5"></span>
    </>
  );
}

function InputField({
  className,
  required,
  name,
  defaultValue,
  placeholder,
  onBlur,
  onChange,
  pattern,
  title,
  type,
  dataTest,
}: {
  className?: string;
  required?: boolean;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onBlur?: any;
  onChange?: any;
  pattern?: string;
  title?: string;
  type: string;
  dataTest: string;
}) {
  return (
    <input
      data-test={dataTest}
      className={`bg-white  font-body font-medium rounded w-full text-base p-2 mm:text-xl${
        className ? " " + className : ""
      }`}
      required={required}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
      pattern={pattern}
      title={title}
      type={type}
      autoCorrect="false"
      autoComplete="false"
    />
  );
}

function RadioItem({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  // console.log({ className });

  return (
    <>
      <div
        className={`mb-1 mt-2 flex items-center${
          className ? " " + className : ""
        }`}
      >
        {children}
      </div>
      <span className="block h-1"></span>
    </>
  );
}

function RadioLabel({
  className,
  children,
  htmlFor,
}: {
  className?: string;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`radio-label block ml-2 font-medium mm:text-lg mm:ml-3 text-neutral-8${
        className ? " " + className : ""
      }`}
    >
      {children}
    </label>
  );
}

function FieldDescription({ children }: { children: ReactNode }) {
  if (children) {
    return (
      <p className="-mt-1 mb-4 mm:mb-3 text-neutral-6 font-light">{children}</p>
    );
  }

  return null;
}
