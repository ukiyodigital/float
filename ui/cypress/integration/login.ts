describe('Login', () => {
  it('should show login', function() {
    cy.visit('http://localhost:3000');
    cy.findByText(/Sign In/).should('exist');
    cy.findByText(/Login/).parent().should('have.class', 'active');
    cy.findByText(/Signup/).parent().not('active');
  })
})
