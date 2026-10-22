describe('Theme', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should change theme to light', () => {
    cy.changeTheme('light')
    cy.get('html').should('have.class', 'light')
  })

  it('should change theme to dark', () => {
    cy.changeTheme('dark')
    cy.get('html').should('have.class', 'dark')
  })

  it('should change theme to system', () => {
    cy.changeTheme('system')
    // Vérifie que la classe correspond au thème système
    cy.get('html').should('have.class', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  it('should persist theme selection', () => {
    cy.changeTheme('dark')
    cy.reload()
    cy.get('html').should('have.class', 'dark')
  })
}) 