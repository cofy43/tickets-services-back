const db = require("../models");

module.exports = {
  createTicket(req, res, next) {
    const { clientId, memberId, statusId } = req;
    const newTiket = req.body;
    newTiket.statusId = statusId;
    newTiket.clientId = clientId;
    newTiket.memberId = memberId;    
    db.ticket
      .create(newTiket)
      .then((result) => {
        next();
        return res.status(201).send({
          message: `Su número de ticket es: ${result.name}, se le será notificado sobre el progreso del ticket`,
        });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },

  updateTicketStatus(req, res) {},

  ticketInfoForCustomer(req, res) {},

  ticketInfoForMember(req, res) {},
};
