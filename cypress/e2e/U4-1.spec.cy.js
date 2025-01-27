import userLogin from '../fixtures/userLogin.json'

describe('Login and Dashboard Tests', () => {
  beforeEach(() => {
    // Visit the welcome page
    cy.visit('http://localhost:5173/');

    // Take a screenshot before clicking the login button
    cy.screenshot('U4-1-before-login');

    // Wait for the Login button to appear and click it
    cy.contains('button', 'Login').should('be.visible').click();

    // Ensure you are on the login page
    cy.url().should('include', '/login');

    // Enter username and password
    cy.get('input[name="username"]').type(userLogin.username);
    cy.get('input[name="password"]').type(userLogin.password);

    // Click the 'Sign in' button
    cy.contains('button', 'Sign in').click();

    // Ensure you are on the dashboard page
    cy.url().should('include', '/dashboard');

    // Take a screenshot after login and redirect to the dashboard
    cy.screenshot('U4-1-after-login');
  });

  it('should display the welcome message/sub title', () => {
    // Wait for the "Welcome back," text to be visible
    cy.contains('Hello, User!').should('be.visible');

    // Check for other dashboard elements
    cy.contains('Your volunteer activities at a glance').should('be.visible');

    // Take a screenshot after verifying other elements
    cy.screenshot('U4-1-dashboard-after-verification');
  });
});