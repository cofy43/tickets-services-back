function associateModels(db) {
  // Relation Many to One
  db.status.hasMany(db.ticket, {
    foreignKey: {
      allowNull: false,
      name: 'statusId'
    },
    as: 'tickets'
  })
  db.ticket.belongsTo(db.status)

  // Relation One to One
  db.client.belongsTo(db.ticket)
  db.ticket.belongsTo(db.client)

  // Relation One to One
  db.ticket.belongsTo(db.member)
  db.ticket.belongsTo(db.member)
};

module.exports = { associateModels }