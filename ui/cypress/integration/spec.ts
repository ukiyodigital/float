describe('CRA', () => {
  it('should show login', function() {
    cy.visit('http://localhost:3000');
    cy.findByText(/Sign In/).should('exist');
  })
})
