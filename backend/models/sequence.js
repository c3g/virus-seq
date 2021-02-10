
const fs = require('fs').promises
const parse = require('csv-parse/lib/sync')
const StreamZip = require('node-stream-zip')

const { SEX } = require('../constants')

module.exports = (sequelize, DataTypes) => {
  const Sequence = sequelize.define('Sequence',
    {
      userId:         { type: DataTypes.INTEGER, allowNull: false },
      strain:         { type: DataTypes.STRING,  allowNull: false },
      collectionDate: { type: DataTypes.DATE,    allowNull: false },
      age:            { type: DataTypes.STRING,  allowNull: false },
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
      readMetadata(metadata.tempFilePath),
      readSequences(sequences.tempFilePath),
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
        data:           sequencesByFilepath[i.filename],
      }
      Object.keys(row).forEach(key => {
        if (row[key] === undefined) {
          console.log(row)
          throw new Error(`Missing "${key}" for row ${n} (${i.filename})`)
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

async function readMetadata(filepath) {
  const data = (await fs.readFile(filepath)).toString()
  return parse(data, {
    columns: true,
    delimiter: '\t',
  })
}
async function readSequences(filepath) {
  const zip = new StreamZip.async({ file: filepath })
  const result = {}
  const entries = await zip.entries()
  for (const entry of Object.values(entries)) {
    result[entry.name] = (await zip.entryData(entry.name)).toString('utf-8')
  }
  return result
}
