describe("Muli-item Step - Multiple Bogeys", () => {
  beforeEach(() => {});
});

it("Should be able to interact with a stateful radio and it's children and have values persist", () => {
  cy.visit("http://localhost:3000/");
  cy.findByRole("link", { name: /Multi-Item Form/ }).click();
  cy.findByLabelText("Not Important").click().clear().type("Yo ho ho");
  cy.findByLabelText("Yes").click();
  cy.findByLabelText("No").click();
  cy.findByLabelText("Yes").click();
  cy.findByLabelText("Maybe").click();
  cy.findByLabelText("Yes").click();
  cy.findByLabelText("Business Name").click().type("Rophy's");
  cy.findByLabelText("Business Address").click().type("12345 Cherry Ave");
  cy.findByText("Todo List").click();
  cy.findByText("Todo List").click();
  cy.findByText("Not Important").click();
});
