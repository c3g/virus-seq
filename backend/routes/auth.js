const express = require('express')
const router = express.Router()
const passport = require('../passport')
const { User } = require('../models')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')

router.use('/is-logged-in', (req, res) => {
  dataHandler(res)(req.user || false)
})

function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return errorHandler(res)(err)
    if (!user)
      return errorHandler(res)(new Error(info.message))
    req.login(user, err => {
      if (err)
        return errorHandler(res)(err)
      dataHandler(res)(user)
    })
  })(req, res, next)
}
router.use('/login', login)

router.use('/logout', (req, res) => {
  req.logout()
  okHandler(res)()
})

router.use('/signup', (req, res) => {
  const data = req.body
  User.signup(data)
  .then(user => login(data))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
