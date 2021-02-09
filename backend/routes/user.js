const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')
const { isAdmin } = require('../helpers/auth')

router.use('/', isAdmin)

router.use('/list', (req, res) => {
  User.findAll()
  .then(users => {
    return users.map(u => u.toJSON())
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

router.use('/invite', (req, res) => {
  const email = req.body.email
  User.invite(email)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

router.use('/update', (req, res) => {
  const data = req.body
  if (!data.id)
    return errorHandler(res)(new Error('Invalid request'))
  const currentUser = req.user
  if (!currentUser.isAdmin() && data.id !== currentUser.id)
    return errorHandler(res)(new Error('Unauthorized request'))
  if (!currentUser.isAdmin() && data.type !== undefined)
    return errorHandler(res)(new Error('Unauthorized request'))
  User.update(data, { where: { id: data.id }, individualHooks: true })
  .then(([count, users]) => users[0])
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
