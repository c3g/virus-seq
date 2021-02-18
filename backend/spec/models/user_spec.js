require('should')
const testHelper = require('../test_helper.js')
const models  = require('../../models')

describe('User', () => {
  it('should be able to create a user correctly', (done) => {
    models.User.create({
      email: 'pchu@gmail.com',
      password: 'hello'
    }).then((user) => {
      user.email.should.equal('pchu@gmail.com')
      user.password.should.not.equal('hello')
      done()
    })
  })

  it('should validate correct password', (done) => {
    models.User.create({
      email: 'pchu@gmail.com',
      password: 'hello'
    }).then((user) => {
      user.password.should.not.equal('hello')
      user.validatePassword('hello').should.be.ok
      done()
    })
  })
})
