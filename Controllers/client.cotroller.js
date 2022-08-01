const { Op } = require("sequelize");
const db = require("../Models");

module.exports = {
  /**
   * Function to find if the user that want create
   * a ticket exist previusly
   * @param {*} req Request object
   * @param {*} res
   * @param {*} next
   */
  createFindCliet(req, res, next) {
    const { email, phone } = req.body.client;
    db.client
      .findAll({
        where: {
          [Op.and]: [
            { email: { [Op.eq]: email } },
            { phone: { [Op.eq]: phone } },
          ],
        },
      })
      .then((clients) => {
        if (clients.length) {
          console.log(clients[0].dataValues);
          req.clietId = clients[0].dataValues.id;
          delete req.body.client;
          next(); // Create a ticket
        } else {
          db.client
            .create(req.body.client)
            .then((newClient) => {
              req.clientId = newClient.dataValues.id;
              delete req.body.client;
              next(); // Find the more free member
            })
            .catch((err) => {
              return res.status(500).send({ message: err.message });
            });
        }
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  },
};