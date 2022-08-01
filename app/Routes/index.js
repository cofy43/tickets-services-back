const { memberRoutes } = require('./member.routes');
const { statusRoutes } = require('./status.routes');
const { ticketRoutes } = require('./ticket.routes');
const { authRoutes } = require('./auth.routes');

module.exports.routes = (app) => {
  statusRoutes(app); 
  memberRoutes(app);
  ticketRoutes(app);
  authRoutes(app);
}