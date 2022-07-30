const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Status extends Model {}

  Status.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      position: {
        type: DataTypes.INTEGER,
        lowNull: false,
        unique: true,
      },
      esFinal: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: "status",
      modelName: "status",
    }
  );

  return Status;
};
