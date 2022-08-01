const db = require("../Models");
const moment = require("moment");
const { generateJWT } = require("../Middlewares/authentication.middleware");
const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../config')

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
                "Auth-Token",
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
                  domain: ".netlify",
                  sameSite: "none",
                  expires: moment().add(1, "d").toDate(),
                }
              );
              member.removePasswordAndSalt();
              res.status(200).send(member);
            }
            return res
              .status(401)
              .send({ message: "Usuario o contraseña incorrecta" });
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
    const token = req.cookies['Auth-Token']
    jwt.verify(token, TOKEN_SECRET, (err, member) => {
      if (!err && (member.ip === req.clientIp) && member.memberId !== undefined) {
        redisClient.del(member.memberId, function(err, response) {
          if (response == 1) {
            console.log("Deleted Successfully!")
          } else{
           console.log("Cannot delete")
          }
        });
      }
    })
    return res.cookie(
      'Auth-Token',
      generateJWT(
        {},
        '0d'
      ),
      {
        secure: true,
        domain: ".netlify",
        expires: moment().toDate()
      }
    )
    //res
    //  .clearCookie('iBrain-Auth-Token')
      .status(200)
      .send({ message: 'Successfully logged out' })
      //.json()
  }
};
