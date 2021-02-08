const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res, next) => {
  res.render('users/login', { title: 'Login' })
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true })
)

module.exports = router
