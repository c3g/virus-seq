
const fs = require('fs').promises
const path = require('path')
const parse = require('csv-parse/lib/sync')
const StreamZip = require('node-stream-zip')
const Fasta = require('bioinformatics-parser').fasta

const {
  SEX,
  PROVINCE,
  PROVINCE_NAME,
  PROVINCE_CODES,
} = require('../constants')

const getProvince = value =>
  value in PROVINCE ? value :
  value in PROVINCE_NAME ? PROVINCE_NAME[value] :
  value === 'Unknown' ? null : value

module.exports = (sequelize, DataTypes, models) => {
  const Sequence = sequelize.define('Sequence',
    {
      uploadId:       { type: DataTypes.INTEGER, allowNull: false },
      strain:         { type: DataTypes.STRING,  allowNull: false },
      collectionDate: { type: DataTypes.DATE,    allowNull: false },
      age:            { type: DataTypes.INTEGER, allowNull: true },
      sex:            { type: DataTypes.ENUM(Object.values(SEX)), allowNull: false },
      province:       { type: DataTypes.ENUM(PROVINCE_CODES), allowNull: true },
      lab:            { type: DataTypes.STRING,  allowNull: false },
      data:           { type: DataTypes.TEXT,    allowNull: false },
    },
    {
      tableName: 'sequences',
    }
  );

  // Static methods
  Sequence.ingest = async function(userId, name, metadataFile, sequencesFile) {
    // throw new Error('unimplemented')
    const [items, sequencesByFilepath] = await Promise.all([
      readMetadata(metadataFile),
      readSequences(sequencesFile),
    ])

    const rows = items.map((i, n) => {
      const row = {
        strain:         i.strain,
        collectionDate: i.date,
        age:            i.age,
        sex:            i.sex,
        province:       getProvince(i.province),
        lab:            i.submitting_lab,
        data:           sequencesByFilepath[i.filename] ||
                        sequencesByFilepath[i.strain],
      }

      /* Row validation */
      Object.keys(row).forEach(key => {
        switch (key) {
          case 'age': {
            if (row.age === 'Unknown') {
              row.age = null
              return
            }
            if (!/^\d+$/.test(row.age))
              throw new Error(`Invalid value ("${row.age}") for "age", row ${n + 2} (${i.filename})`)
            row.age = parseInt(row.age, 10)
            return
          }
          case 'collectionDate': {
            if (Number.isNaN(Date.parse(row.collectionDate)))
              throw new Error(`Invalid value ("${row.collectionDate}") for "date", row ${n + 2} (${i.filename})`)
            return
          }
          default: {
            const value =
              typeof row[key] === 'string' ?
                row[key].trim() :
                row[key]
            if (value === undefined || value === '')
              throw new Error(`Missing "${key}" for row ${n + 2} (${i.filename})`)
          }
        }
      })

      return row
    })

    const upload = await models.Upload.create({ userId, name })
    rows.forEach(row => { row.uploadId = upload.id })
    const sequences = await Sequence.bulkCreate(rows)
    return { upload, sequences }
  }

  // Instance methods
  Sequence.prototype.toJSON = function() {
    const result = Object.assign({}, this.get())
    result.data = result.data.length
    return result
  }

  return Sequence;
};

async function readMetadata(file) {
  const data = (await fs.readFile(file.tempFilePath)).toString()
  return parse(data, {
    columns: true,
    delimiter: '\t',
  })
}

async function readSequences(file) {
  const ext = path.extname(file.name)
  switch (ext) {
    case '.zip':
      return readSequencesZip(file)
    case '.fa':
    case '.faa':
    case '.fasta':
      return readSequencesFasta(file)
  }
  throw new Error(`Invalid file type: "${ext}"`)
}

async function readSequencesZip(file) {
  const zip = new StreamZip.async({ file: file.tempFilePath })
  const result = {}
  const entries = await zip.entries()
  for (const entry of Object.values(entries)) {
    result[entry.name] = (await zip.entryData(entry.name)).toString('utf-8')
  }
  return result
}

async function readSequencesFasta(file) {
  const content = (await fs.readFile(file.tempFilePath)).toString()
  const { ok, error, result: sequences } = Fasta.parse(content)
  if (!ok)
    throw error
  const result = {}
  for (const sequence of sequences) {
    const identifier = sequence.description.split(' ')[0]
    result[identifier] = sequence.data
  }
  return result
}
