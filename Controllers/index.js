const statusController = require('./status.controller');
const memberController = require('./member.controller');
const ticketController = require('./ticket.controller');
const clientController = require('./client.cotroller');
const authController = require('./auth.controller');

module.exports = {
  authController,
  statusController,
  memberController,
  ticketController,
  clientController  
}