const jwt = require("jsonwebtoken");
const { TOKEN_SECRET, TOKEN_EXPIRES } = require("../Config");

module.exports = {
  authenticateJWT(req, res, next) {
    const token = req.cookies["homely-Ticket-Auth-Token"];
    if (token) {
      jwt.verify(token, TOKEN_SECRET, (err, member) => {
        if (err || member.memberId === undefined) {
          return res
            .status(401)
            .send({
              message: "No tienes autorización para realizar la acción",
            });
        } else {
          req.member = member;
          next();
        }
      });
    } else {
      return res
        .status(401)
        .send({ message: "No tienes autorización para realizar la acción" });
    }
  },

  generateJWT(body, expires = TOKEN_EXPIRES) {
    return jwt.sign(body, TOKEN_SECRET, { expiresIn: expires });
  },
};
