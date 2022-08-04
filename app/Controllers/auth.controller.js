const db = require("../Models");
const moment = require("moment");
const { generateJWT } = require("../Middlewares/authentication.middleware");
const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../Config')

module.exports = {
  login(req, res) {
    const { email, password } = req.body;
    db.member
      .findOne({
        where: {
          email: email,
        },
      })
      .then((member) => {
        member = member;
        if (!member)
          return res
            .status(401)
            .send({ message: "Usuario o contraseña incorrecta" });
        member
          .validPassword(password)
          .then((isPassword) => {
            if (isPassword) {
              res.cookie(
                "homely-Ticket-Auth-Token",
                generateJWT(
                  {
                    memberId: member.dataValues.id,
                    ip: req.clientIp,
                    created: moment(),
                    email: member.dataValues.email,
                  },
                  "8d"
                ),
                {
                  secure: true,
                  // domain: '.netlify.app',
                  sameSite: 'none',
                  expires: moment().add(7, 'd').toDate()
                }
              );
              member.removePasswordAndSalt();
              return res.status(200).send(member);
            } else {
              return res
                .status(401)
                .send({ message: "Usuario o contraseña incorrecta" });
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(401)
              .send({ message: "Usuario o contraseña incorrecta" });
          });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .send({ message: "Usuario o contraseña incorrecta" });
      });
  },

  logout(req, res) {        
    const token = req.cookies['homely-Ticket-Auth-Token']
    jwt.verify(token, TOKEN_SECRET, (err, member) => {
      if (!err && member.memberId !== undefined) {        
        res.clearCookie("homely-Ticket-Auth-Token"),
        res.end()        
        return res.status(200);
      } else {        
        return res.status(500).send({ message: "Ocurrio un error inesperado, contacta a soporte tecnico" })
      }
    })
  }
};
