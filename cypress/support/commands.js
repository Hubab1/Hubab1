// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add('login', () => {
    // TODO: add global var for url for chuck and woodhouse
    // TODO: create a test user
    // Maybe use cy.localstorage to persist https://stackoverflow.com/questions/50820732/in-cypress-set-a-token-in-localstorage-before-test
    cy.request('POST', 'http://localhost:8000/api/onlineleasing/communities/1/login/', {
        email: "cypress+user1@nestio.com",
        password: "funnelleasing"
    })
    .then((response) => {
        const nowPlus30Days = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).getTime();
        localStorage.setItem('expires_at', nowPlus30Days);
        localStorage.setItem('access_token', response.body.token);
        localStorage.setItem('scope', "1");
    });
});
