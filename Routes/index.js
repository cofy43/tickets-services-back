const { memberRoutes } = require('./member.routes');
const { statusRoutes } = require('./status.routes');
const { ticketRoutes } = require('./ticket.routes');

module.exports.routes = (app) => {
  statusRoutes(app); 
  memberRoutes(app);
}