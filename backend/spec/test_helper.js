process.env.NODE_ENV = 'test';

const DatabaseCleaner = require('database-cleaner');
const databaseCleaner = new DatabaseCleaner("postgresql");
const config = require('../config/config.json');
const models  = require('../models');
const connectionString = 'postgres://' + config['test']['username'] + '@' + config['test']['host']  + '/' + config['test']['database'];
const pg = require('pg');

before(function(done) {
  models.sequelize.sync().then(function() {
    console.log('Syncing database for NODE_ENV' + process.env.NODE_ENV);
    done();
  });
});

afterEach(function (done) {
  cleanUpDb(function() {
    done();
  });
});

exports.cleanUpDb = cleanUpDb = (callback) => {
  pg.connect(connectionString, (err, client, done) => {
    databaseCleaner.clean(client, function(){
      models.User.count().then(count => {
        count.should.equal(0);
        done();
        callback();
      });
    });
  });
};

