/// <reference types="cypress" />

context('Login, Invite & Sign Up', () => {

  let createdAccount = undefined

  // Helpers
  const login = (
    email = 'romain.gregoire@mcgill.ca',
    password = 'secret'
  ) => {
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('form').submit()
  }

  beforeEach(() => {
    cy.visit('http://localhost:3001/login')
  })

  it('logs in', () => {
    login()
    cy.url().should('contain', '/user/profile')
    cy.contains('Welcome, Admin')
  })

  it('invites users', () => {
    login()
    cy.get('[href="/admin/users"]').click()
    cy.url()
      .should('contain', '/admin/users')
    cy.log('Creating email account...')
    cy.wait(1000)

    cy.task('ethereal__create')
      .then(result => {
        createdAccount = result

        cy.log('Created email account: ' + createdAccount.username)

        cy.get('#email')
          .type(createdAccount.username)
        cy.get('form').submit()

        cy.contains(createdAccount.username)
      })
  })

  it('can sign up', () => {
    cy.task('ethereal__findSignUpLink', createdAccount)
      .then(url => {
        cy.visit(url)

        const [firstName, lastName] = createdAccount.name.split(' ')
        const lab = 'Bourque'
        const institution = 'McGill'
        const institutionAddress = '704 Dr. Penfield'

        cy.get('#password').type(createdAccount.password)
        cy.get('#firstName').type(firstName)
        cy.get('#lastName').type(lastName)
        cy.get('#lab').type(lab)
        cy.get('#institution').type(institution)
        cy.get('#institutionAddress').type(institutionAddress)

        cy.get('form').submit()

        cy.contains(`Welcome, ${firstName}`)
        cy.get('#firstName').should('have.value', firstName)
        cy.get('#lastName').should('have.value', lastName)
        cy.get('#lab').should('have.value', lab)
        cy.get('#institution').should('have.value', institution)
        cy.get('#institutionAddress').should('have.value', institutionAddress)
      })
  })

  it('can submit data', () => {
    login(createdAccount.username, createdAccount.password)
    cy.get('[href="/user/submit"]').click()
    cy.url().should('contain', '/user/submit')

    cy.get('#name').type('test-upload')
    // FIXME: need to expose an input[type=file] in DropZone before
    // implementing this this
    // cy.get('#metadata input[type=file]').attachFile('metadata.tsv')
    // cy.get('#sequences input[type=file]').attachFile('sequences.tsv')
    // cy.get('form').submit()
  })
})
