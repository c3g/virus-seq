
module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('Upload',
    {
      userId:         { type: DataTypes.INTEGER, allowNull: false },
      name:           { type: DataTypes.STRING,  allowNull: true },
    },
    {
      tableName: 'uploads',
    }
  );

  return Upload;
}
