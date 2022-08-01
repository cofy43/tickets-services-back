const db = require("../models");

module.exports = {
  createTicket(req, res) {
    const { clientId, memberId, statusId } = req;
    const newTiket = req.body;
    newTiket.statusId = statusId;
    newTiket.clientId = clientId;
    newTiket.memberId = memberId;    
    db.ticket
      .create(newTiket)
      .then((result) => {
        // TODO: send notification to assinged member in this part
        console.log(result);
        return res
          .status(201)
          .send({
            message:
              "Ticket creado, se le será notificado sobre el progreso del ticket",
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
