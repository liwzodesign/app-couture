import '@testing-library/cypress/add-commands'

// Ajoute des commandes personnalisées
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('changeTheme', (theme: 'light' | 'dark' | 'system') => {
  cy.get(`[title="${theme}"]`).click()
})

// Déclare les types pour les commandes personnalisées
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      changeTheme(theme: 'light' | 'dark' | 'system'): Chainable<void>
    }
  }
} 