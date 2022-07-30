const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Ticket extends Model {}

  Ticket.init(
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
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      underscored: true,
      tableName: "ticket",
      modelName: "ticket",
    }
  );

  return Ticket;
};
