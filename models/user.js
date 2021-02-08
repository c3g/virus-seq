const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { USER_TYPE } = require('../constants')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      type: DataTypes.ENUM(Object.values(USER_TYPE)),
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      institution: DataTypes.STRING,
      institutionAddress: DataTypes.STRING,
      lab: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING(36),
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate : (user, options) => {
          return hashPassword(user)
        }
      },
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password)
        }
      }
    }
  );
  return User;
};

function hashPassword(user) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return reject(err)

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err)
          return reject(err)

        user.password = hash
        user.token = uuid.v4()
        resolve(user)
      })
    })
  })
}

