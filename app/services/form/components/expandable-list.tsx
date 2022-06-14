import type { ExpandableListBlueprint } from "../types";
import { Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import { FiPlusCircle } from "react-icons/fi";
import { FormField } from "../form-field";

export function ExpandableList({
  fieldBlueprint,
  fieldContext,
}: {
  fieldBlueprint: ExpandableListBlueprint;
  fieldContext: {
    value: string[];
    errors: string[];
  };
}) {
  const submit = useSubmit();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [selectedAction, setSelectedAction] = useState("");
  const [listItems, setListItems] = useState<any[] | []>([]);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  useEffect(() => {
    console.log("context changed");

    setListItems(fieldContext?.value);
    console.log({ listItems });
  }, [fieldContext, listItems]);

  let { listItemStructure } = fieldBlueprint;

  let fieldsToShowInTable = {};
  listItemStructure.forEach((field) => {
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
        onClick={(e) => {
          e.preventDefault();
          setSelectedIndex(undefined);
          setSelectedAction("");
          open();
        }}
      >
        <span className="add-item-icon">
          <FiPlusCircle />
        </span>
        {fieldBlueprint.addItemLabel}
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
                    } else {
                      return null;
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
                        onClick={(e) => {
                          e.preventDefault();
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
                        onClick={(e) => {
                          e.preventDefault();
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
        <DialogContent aria-label={fieldBlueprint.addOrEditItemModalLabel}>
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
                  } else {
                    return null;
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
                  ? fieldBlueprint.editItemLabel
                  : fieldBlueprint.addItemLabel}
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
                          ? fieldContext?.value[selectedIndex]
                          : fieldContext
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
