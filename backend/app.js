const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('cookie-session')
// const favicon = require('serve-favicon')

const passport = require('./passport')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))
app.use(session({
  secret: 'Phoenix,BerniceAjgioiguoquou05u98unfau0t84095u02105aioa',
}))
app.use(passport.initialize())
app.use(passport.session())

// API routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))

// Frontend
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', sendIndex)

function sendIndex(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
}

// Error handlers

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    console.error(err.stack)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
