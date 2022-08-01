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
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      underscored: true,
      tableName: "ticket",
      modelName: "ticket",
      hooks: {
        beforeCreate (newTicket, options) {
          return Ticket.findAll({
            limit: 1,            
            order: [['createdAt', 'DESC']]
          }).then((lastCase) => {
            // TODO REMOVE
            if (lastCase.length === 0) { return newTicket.setDataValue('name', `Homely-${1}`) }
            return newTicket.setDataValue(
              'name',
              `Homely-${lastCase[0].getDataValue('id') + 1}`
            )
          })
        }
      }
    }
  );

  return Ticket;
};
