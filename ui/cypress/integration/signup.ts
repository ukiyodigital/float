describe('Signup Form', () => {
  it('should navigate to signup', function() {
    cy.visit('http://localhost:3000');
    cy.findByText(/Signup/).click();
    cy.findByText(/Signup/).parent().should('have.class', 'active');
  })
})
