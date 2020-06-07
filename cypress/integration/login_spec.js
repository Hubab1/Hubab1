describe('Login', () => {
    it('Visits login', () => {
        cy.visit('http://localhost:3000/1/login');

        cy.url().should('contain', 'login');

        cy.contains('Welcome Back');

        // check form fields
        cy.get('[name="email"]');
        cy.get('[name="password"]');

        // check forgot password and signup link
        cy.get('[href="/1/password/forgot"]');
        cy.get('[href="/1/signup"]');
    });

    it('Displays errors', () => {
        cy.visit('http://localhost:3000/1/login');

        cy.get('[name="email"]').type('bad email');
        cy.contains('Sign In').click();

        cy.get('[name="email"]')
          .should('have.attr', 'aria-invalid', 'Must be a valid Email');
        cy.get('[name="password"]')
          .should('have.attr', 'aria-invalid', 'Password is required');

        // password length
        cy.get('[name="password"]').type('123');
        cy.get('[name="password"]')
          .should('have.attr', 'aria-invalid', 'Password must be at least 8 characters');

        // acount does not match records

        cy.get('[name="email"]').clear().type('bademail@nestio.com');
        cy.get('[name="password"]').type('funnelleasing');
        cy.contains('Sign In').click();
        cy.contains('The email and password you entered do not match our records. Please try again.');
    });

    it('Verifies login', () => {
        cy.visit('http://localhost:3000/1/login');

        // TODO: make these global vars
        cy.get('[name="email"]').type('cypress+user1@nestio.com');
        cy.get('[name="password"]').type('funnelleasing');
        cy.contains('Sign In').click();
        cy.url().should('contain', 'address');
    });
});
