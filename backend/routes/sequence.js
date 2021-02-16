const express = require('express')
const router = express.Router()
const { uniq } = require('rambda')
const { Op } = require('sequelize')
const { Sequence, Upload } = require('../models')
const { dataHandler, errorHandler } = require('../helpers/handlers')
const { isLoggedIn } = require('../helpers/auth')

router.use('/', isLoggedIn)

router.use('/submit', (req, res) => {
  const { name } = req.body
  const { metadata, sequences } = req.files

  Sequence.ingest(req.user.id, name, metadata, sequences)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

router.use('/list', (req, res) => {
  const condition = req.user.isAdmin() ?
    undefined :
    { where: { userId: req.user.id } }

  Sequence.findAll(condition)
  .then(sequences =>
    Upload.findAll({ where: { 
      id: { [Op.in]: uniq(sequences.map(s => s.uploadId)) }
    }})
    .then(uploads => ({
      sequences, uploads
    }))
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
