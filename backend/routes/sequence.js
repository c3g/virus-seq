const express = require('express')
const router = express.Router()
const { Sequence } = require('../models')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')
const { isLoggedIn } = require('../helpers/auth')

router.use('/', isLoggedIn)

router.use('/submit', (req, res) => {
  const { metadata, sequences } = req.files

  Sequence.ingest(req.user.id, metadata, sequences)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

router.use('/list', (req, res) => {
  const condition = req.user.isAdmin() ?
    undefined :
    { where: { userId: req.user.id } }

  Sequence.findAll(condition)
  .then(sqs => sqs.map(s => s.toJSON()))
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
