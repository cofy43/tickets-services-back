const db = require("../Models");

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

  preprareChange(req, res, next) {
    const { ticketId } = req.params;
    const { memberId } = req.member;
    db.ticket
      .findOne({
        where: {
          id: ticketId,
          memberId: memberId,
        },
        include: [{ model: db.status, attributes: ["position", "esFinal"] }],
      })
      .then((ticket) => {
        if (!ticket)
          return res.status(404).send({ message: "Ticket no encontrado" });

        if (ticket.dataValues.status.dataValues.esFinal)
          return res.status(400).send({
            message:
              "Ticket ya no se puede actualizar porque se encuentra en un estatus final",
          });
        // We validated that the new status have a previus or next position
        // than the previus status
        req.ticket = ticket;
        next();
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).send({ message: "Ticket no encontrado" });
      });
  },

  updateTicketStatus(req, res, next) {
    const { ticketId } = req.params;
    const { esFinal } = req.body;
    db.ticket
      .update(req.body, {
        where: {
          id: ticketId,
        },
        returning: true,
        plain: true,
        include: [{ model: db.status, attributes: ["esFinal"] }],
      })
      .then((ticket) => {
        if (esFinal) {
          // Reduced the active tickets count of member
          next();
        }
        return res.status(200).send(ticket);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message:
            "Ha ocurrido un error inesperdado, contacte a soporte técnico",
        });
      });
  },

  ticketInfoForCustomer(req, res) {
    const { ticketName } = req.query;
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

  ticketsTodo(req, res) {
    const { memberId } = req.member;
    db.ticket
      .findAll({
        where: { memberId: memberId },
        include: [
          {
            model: db.status,
            where: {
              esFinal: false,
            },
          },
          { model: db.client },
        ],
      })
      .then((listTodo) => {
        return res.status(200).send(listTodo);
      })
      .catch((err) => {
        return res
          .status(500)
          .send({
            message:
              "Ha ocurrido un error inesperdado, contacte a soporte técnico",
          });
      });
  },

  ticketsCompleted(req, res) {
    const { memberId } = req.member;
    db.ticket
      .findAll({
        where: { memberId: memberId },
        include: [
          {
            model: db.status,
            where: {
              esFinal: true,
            },
          },
          { model: db.client },
        ],
      })
      .then((completedTickets) => {
        return res.status(200).send(completedTickets);
      })
      .catch((err) => {
        return res
          .status(500)
          .send({
            message:
              "Ha ocurrido un error inesperdado, contacte a soporte técnico",
          });
      });
  },
};
