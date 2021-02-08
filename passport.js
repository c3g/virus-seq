/*
 * passport.js
 */

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models').User;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findOne(id).success(user => { done(null, user); });
});

// authentication setup
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email : email } }).then((user) => {
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    });
  }
));

module.exports = passport
