const express = require('express')
const router = express.Router()
const passport = require('../passport')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')

router.use('/is-logged-in', (req, res) => {
  dataHandler(res)(req.user || false)
})

router.use('/login', (req, res, next) => {
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
})

router.use('/logout', (req, res) => {
  req.logout()
  okHandler(res)()
})

module.exports = router
