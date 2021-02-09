
module.exports = (sequelize, DataTypes) => {
  const Sequence = sequelize.define('Sequence',
    {
      userId:         { type: DataTypes.INTEGER, allowNull: false },
      strain:         { type: DataTypes.STRING,  allowNull: false },
      collectionDate: { type: DataTypes.DATE,    allowNull: false },
      age:            { type: DataTypes.INTEGER, allowNull: false },
      sex:            { type: DataTypes.STRING,  allowNull: false },
      province:       { type: DataTypes.STRING,  allowNull: false },
      lab:            { type: DataTypes.STRING,  allowNull: false },
      data:           { type: DataTypes.TEXT,    allowNull: false },
    },
    {
      tableName: 'sequences',
    }
  );

  return Sequence;
};

