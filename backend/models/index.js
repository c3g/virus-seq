const fs = require('fs');
const path = require('path');
const clone = require('clone');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize

const { USER_TYPE } = require('../constants')

const basename = path.basename(module.filename);

const env = process.env.NODE_ENV || 'development';
const config = clone(require('../config').database[env]);
config.logging = env === 'development' ? console.log : false;
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);


// Exported models
const models = {};

fs
.readdirSync(__dirname)
.filter(file => (file.indexOf('.') !== 0) && (file !== basename))
.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, DataTypes, models);
  models[model.name] = model;
});

// Setup & initialize database
(async () => {
  console.log('Sync start')
  try {
    await sequelize.sync()
    console.log('Sync done')
  } catch (err) {
    console.error('Sync failed')
    console.error(err)
  }

  const users = await models.User.findAll()
  if (users.length === 0) {
    await models.User.create({
      type: USER_TYPE.ADMIN,
      firstName: 'Admin',
      lastName: 'Admin',
      institution: 'McGill',
      institutionAddress: null,
      lab: null,
      email: 'romain.gregoire@mcgill.ca',
      password: 'secret',
    })
  }
})();

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
