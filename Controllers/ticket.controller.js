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

  ticketInfoForCustomer(req, res) {
    const { ticketName } = req.body;
    db.ticket
      .findOne({
        where: {
          name: ticketName,
        },
        attributes: ["name", "notes", "createdAt", "updatedAt"],
        include: [
          {
            model: db.status,
            attributes: ["name", "esFinal", "position"],
          },
        ],
      })
      .then((ticket) => {
        if (!ticket)
          return res.status(404).send({ message: "Ticket no encontrado" });
        return res.status(200).send(ticket);
      })
      .catch((err) => {
        return res.status(404).send({ message: "Ticket no encontrado" });
      });
  },

  ticketInfoForMember(req, res, next) {
    const { ticketId } = req.params;
    const { memberId } = req.member;
    db.ticket
      .findOne({
        where: {
          id: ticketId,
          memberId: memberId,
        },
        include: [
          { model: db.status, attributes: ["id", "name", "position"] },
          { model: db.client },
        ],
      })
      .then((ticket) => {
        if (!ticket)
          return res.status(404).send({ message: "Ticket no encontrado" });
        // If the ticket is closed
        if (ticket.dataValues.status.esFinal)
          return res.status(200).send(ticket);
        // If istn't closed so search the next and the previus status
        req.ticket = ticket;
        next();
      })
      .catch((err) => {
        return res.status(404).send({ message: "Ticket no encontrado" });
      });
  },
};
