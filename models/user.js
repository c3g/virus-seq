const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      institution: DataTypes.STRING,
      institutionAddress: DataTypes.STRING,
      lab: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate : (user, options, next) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash;
              next(null, user);
            });
          });
        }
      },
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    }
  );
  return User;
};

