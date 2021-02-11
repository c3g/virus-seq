
const fs = require('fs').promises
const path = require('path')
const parse = require('csv-parse/lib/sync')
const StreamZip = require('node-stream-zip')
const Fasta = require('bioinformatics-parser').fasta

const { SEX } = require('../constants')

module.exports = (sequelize, DataTypes) => {
  const Sequence = sequelize.define('Sequence',
    {
      userId:         { type: DataTypes.INTEGER, allowNull: false },
      strain:         { type: DataTypes.STRING,  allowNull: false },
      collectionDate: { type: DataTypes.DATE,    allowNull: false },
      age:            { type: DataTypes.INTEGER, allowNull: true },
      sex:            { type: DataTypes.ENUM(Object.values(SEX)), allowNull: false },
      province:       { type: DataTypes.STRING,  allowNull: false },
      lab:            { type: DataTypes.STRING,  allowNull: false },
      data:           { type: DataTypes.TEXT,    allowNull: false },
    },
    {
      tableName: 'sequences',
    }
  );

  // Static methods
  Sequence.ingest = async function(userId, metadata, sequences) {
    // throw new Error('unimplemented')
    const [items, sequencesByFilepath] = await Promise.all([
      readMetadata(metadata),
      readSequences(sequences),
    ])

    const rows = items.map((i, n) => {
      const row = {
        userId:         userId,
        strain:         i.strain,
        collectionDate: i.date,
        age:            i.age,
        sex:            i.sex,
        province:       i.province,
        lab:            i.submitting_lab,
        data:           sequencesByFilepath[i.filename] || sequencesByFilepath[i.strain],
      }

      /* Row validation */
      Object.keys(row).forEach(key => {
        const value =
          typeof row[key] === 'string' ?
            row[key].trim() :
            row[key]
        switch (key) {
          case 'age': {
            if (value === 'Unknown') {
              row[key] = null
              return
            }
            if (!/^\d+$/.test(value))
              throw new Error(`Invalid value ("${value}") for "age", row ${n} (${i.filename})`)
            row[key] = parseInt(value, 10)
            return
          }
          default: {
            if (value === undefined || value === '')
              throw new Error(`Missing "${key}" for row ${n} (${i.filename})`)
          }
        }
      })

      return row
    })

    return await Sequence.bulkCreate(rows)
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
