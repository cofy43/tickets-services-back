const { Op, UniqueConstraintError } = require("sequelize");
const sequelize = require("sequelize");
const db = require("../Models");

module.exports = {
  /**
   * Create a new member register, the password save
   * emcryted with bycryp and save the random salt
   * @param {*} req
   * @param {*} res
   */
  createMember(req, res) {
    db.member
      .create(req.body)
      .then((member) => {
        return res.status(201).send({ message: "Nuevo miembro registrado" });
      })
      .catch((err) => {
        if (err instanceof UniqueConstraintError) {
          return res.status(400).send({
            message: `El email ${req.body.email} ya se encuetra registrado`,
          });
        } else {
          return res.status(500).send(err.message);
        }
      });
  },

  updateMember(req, res) {
    const { memberId } = req.params;
    db.member
      .update(req.body, {
        where: { id: memberId },
        returning: true,
      })
      .then(([rows, [memberUser]]) => {
        if (!rows) {
          res.status(404).send({ message: "Ocirrio un error inesperado" });
        } else {
          res.status(200).send({ message: "Registro actualizado" });
        }
      })
      .catch((err) => {
        if (err instanceof UniqueConstraintError) {
          return res.status(400).send({
            message: `El email ${req.body.email} ya se encuetra registrado`,
          });
        } else {
          return res.status(500).send({ message: err.message });
        }
      });
  },

  getMoreFreeMember(req, res, next) {
    db.member
      .findOne({
        order: sequelize.fn("min", sequelize.col("active_tickets")),
        group: "id",
      })
      .then((member) => {
        req.memberId = member.dataValues.id;
        next(); // Find the firts status to assing a new ticket
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },

  assisngTicket(req, res, next) {
    const { memberId } = req;
    db.member
      .increment(
        { activeTickets: 1, totalTickets: 1 },
        { where: { id: memberId } }
      )
      .then((result) => {
        // TODO: send notification to assinged member in this part
        next();
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },

  ticketEnding(req, res) {
    const { memberId } = req.member;
    return db.member.decrement(
      { activeTickets: 1 },
      { where: { id: memberId } }
    );
  },

  findMemberInfo(req, res) {
    const { memberId } = req.member;
    db.member.findOne({
      where: {
        id: memberId
      },
      attributes: ["name", "fatherLastName", "motherLastName", "activeTickets", "totalTickets"]
    })
      .then((member) => {
        return res.status(200).send(member);
      }).catch((err) => {        
        return res
          .status(500)
          .send({
            message:
              "Ocurrio un error inesperado, por favor contacta a soporte t??cnico",
          });
      });
  }
};
