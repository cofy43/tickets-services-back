const { UniqueConstraintError, Op } = require("sequelize");
const sequelize = require("sequelize");
const db = require("../Models");

module.exports = {
  /**
   * Create a new status register
   * @param {*} req Request object, required body of status
   * @param {*} res
   * @returns Return message
   */
  createStatus(req, res) {
    db.status
      .create(req.body)
      .then((status) => {
        return res.status(201).send("Nuevo estatus creado");
      })
      .catch((err) => {
        if (err instanceof UniqueConstraintError) {
          return res.status(400).send({
            message: `El estatus: "${req.body.name}" ya existe`,
          });
        } else {
          return res.status(500).send({ message: err.message });
        }
      });
  },

  getStatusList(req, res) {
    db.status
      .findAll()
      .then((statusList) => {
        return res.status(200).send(statusList);
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },

  getFirstStatus(req, res, next) {
    db.status
      .findOne({
        order: sequelize.fn("min", sequelize.col("position")),
        group: "id",
      })
      .then((firstStatus) => {
        req.statusId = firstStatus.dataValues.id;
        next(); // Create a ticket
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },

  getPreviousAndNexstatus(req, res) {
    const { position } = req.ticket.status;
    db.status
      .findAll({
        where: {
          [Op.and]: [
            { position: [position - 1, position + 1] },
            { esFinal: false },
          ],
        },
      })
      .then((status) => {
        // We has previus and next status
        const ticket = req.ticket;
        if (status.length === 2) {
          ticket.dataValues.status.dataValues.nextStatusId =
            status[0].dataValues.id;
          ticket.dataValues.status.dataValues.nextStatus =
            status[0].dataValues.name;
          ticket.dataValues.status.dataValues.previusStatusId =
            status[1].dataValues.id;
          ticket.dataValues.status.dataValues.previusStatus =
            status[1].dataValues.name;
        } else if (status.length) {
          ticket.dataValues.status.dataValues.nextStatusId =
            status[0].dataValues.id;
        }
        return res.status(200).send(ticket);
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Ocurrio un error inesperado, contacte a soporte técnico",
        });
      });
  },

  haveValidPostion(req, res, next) {
    const { position } = req.ticket.dataValues.status.dataValues;
    const { newStatusId } = req.body;
    // Find if new status' position has distance
    // 1 of actuall status' position of if end
    db.status
      .findOne({
        where: {
          [Op.and]: [
            { id: newStatusId },
            {
              [Op.or]: [
                { position: position },
                { position: position - 1 },
                { position: position + 1 },
                { esFinal: true },
              ],
            },
          ],
        },
      })
      .then((status) => {
        if (!status)
          return res.status(400).send({ message: "Estatus invalido" });
        // We updated the status and notes
        req.body.esFinal = status.dataValues.esFinal;
        req.body.statusId = status.dataValues.id;
        next();
      })
      .catch((err) => {});
  },
};
