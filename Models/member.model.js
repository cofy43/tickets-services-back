const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Member extends Model {}

  Member.init(
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
      fatherLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      motherLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activeTickets: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: "member",
      modelName: "member",
    }
  );

  return Member;
};
