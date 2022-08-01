const { associateModels } = require('./associations')
const { Sequelize } = require('sequelize')
const { database } = require('../Config')

const sequelize = new Sequelize(database.URL, database.OPTIONS)

sequelize.sync(database.SYNC).then(() => {
  // Sincroniza la base de datos
  console.log('Sync db successful.')
})

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize
}

db.client = require('./client.model')(sequelize);
db.member = require('./member.model')(sequelize);
db.status = require('./status.model')(sequelize);
db.ticket = require('./ticket.model')(sequelize);

associateModels(db)

module.exports = db