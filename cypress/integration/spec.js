/// <reference types="cypress" />
describe('intercept', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it.only('loads users', () => {
    cy.pause()
  
    // https://on.cypress.io/intercept
    cy.intercept({
      pathname: '/users',
      query: {
        _limit: '3'
      }
    }, {
        fixture: 'users.json',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
    }).as('users')

    cy.get('#load-users').click()
    cy.wait('@users')

    cy.get('.user').should('have.length', 3)
    cy.wait(2000)
  })

  it('uses minimatch to intercept', () => {
    cy.pause()

    cy.intercept('**/users?*').as('users')
    cy.get('#load-users').click()
    cy.wait('@users')
    cy.wait(2000)
  })

  it('uses minimatch to intercept (2)', () => {
    cy.pause()

    // https://www.npmjs.com/package/minimatch
    expect(
      Cypress.minimatch(
        'https://jsonplaceholder.cypress.io/users?_limit=3',
        '**/users?_limit=+(3|5)'
      )
      , 'Minimatch test'
    ).to.be.true
    cy.intercept('**/users?_limit=+(3|5)').as('users')
    cy.get('#load-users').click()
    cy.wait('@users').its('response.body').should('have.length', 3)

    // intercepts _limit=5 requests
    cy.get('#load-five-users').click()
    cy.wait('@users').its('response.body').should('have.length', 5)
    cy.wait(2000)
  })

  it.skip('uses substring to intercept', () => {
    cy.pause()

    cy.intercept('_limit=3').as('users')
    cy.get('#load-users').click()
    cy.wait('@users')
    cy.wait(2000)
  })

  it('uses regexp to intercept', () => {
    cy.pause()

    cy.intercept(/\/users\?_limit=(3|5)$/).as('users')
    cy.get('#load-users').click()
    cy.wait('@users').its('response.body').should('have.length', 3)

    // intercepts _limit=5 requests
    cy.get('#load-five-users').click()
    cy.wait('@users').its('response.body').should('have.length', 5)
    cy.wait(2000)
  })
})
