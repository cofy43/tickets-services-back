const { UniqueConstraintError } = require('sequelize')
const db = require('../models');

module.exports = {
  /**
   * Create a new status register
   * @param {*} req Request object, required body of status
   * @param {*} res 
   * @returns Return message
   */
  createStatus(req, res) {

    return db.status
      .create(req.body)
      .then((status) => {
        return res.status(201).send('Nuevo estatus creado');
      }).catch((err) => {
        if (err instanceof UniqueConstraintError) {
          return res.status(400).send({
            message: `El estatus: "${req.body.name}" ya existe`
          })
        } else {
          return res.status(500).send({ message: err.message }); 
        }
      });
  },

  getStatusList(req, res) {
    return db.status.findAll()
    .then((statusList) => {
      return res.status(200).send(statusList);
    }).catch((err) => {
      return res.status(500).send({ message: err.message }); 
    });
  }
}