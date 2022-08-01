const { UniqueConstraintError } = require("sequelize");
const sequelize = require("sequelize");
const db = require("../models");

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
};
