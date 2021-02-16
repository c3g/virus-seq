const path = require('path')
const express = require('express')
const flash = require('express-flash')
const fileUpload = require('express-fileupload')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('cookie-session')

const passport = require('./passport')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


app.use(logger('dev'))
app.use(bodyParser.json({ limit: '2048mb' }))
app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir: '/tmp',
  limits: { fileSize: 2048 * 1024 * 1024 },
}))
app.use(session({
  secret: 'Phoenix,BerniceAjgioiguoquou05u98unfau0t84095u02105aioa',
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// API routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/user',     require('./routes/user'))
app.use('/api/sequence', require('./routes/sequence'))

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
  console.error(err)
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
