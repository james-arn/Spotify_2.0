import "@testing-library/cypress/add-commands";

it("user can make payment", () => {
  // login
  cy.visit("http://localhost:3000/login/");
  cy.findByRole("button", { name: /login with spotify/i }).click();
});
