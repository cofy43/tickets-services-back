const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, TOKEN_EXPIRES } = require('../Config')

module.exports = {
  authenticateJWT (req, res, next) {
    const token = req.cookies['Auth-Token']
    if (token) {
      jwt.verify(token, TOKEN_SECRET, (err, member) => {
        if (err || (member.ip !== req.ip) || member.memberId === undefined) {
          return res
            .status(401)
            .send({ message: "No tienes autorización para realizar la acción" })
        } else {
          req.member = member
          next()
        }
      })
    } else {
      return res
        .status(401)
        .send({ message: "No tienes autorización para realizar la acción" })
    }
  },

  authenticateEmailJWT (req, res, next) {
    const token = req.headers.authorization    
    if (token) {
      jwt.verify(token, TOKEN_SECRET, (err, user) => {        
        if (err || user.email === undefined) {
          return res
            .status(401)
            .send({ message: "No tienes autorización para realizar la acción" })
        } else {
          req.user = user
          next()
        }
      })
    } else {
      return res
        .status(401)
        .send({ message: "No tienes autorización para realizar la acción" })
    }
  },

  generateJWT (body, expires = TOKEN_EXPIRES) {    
    return jwt.sign(body, TOKEN_SECRET, { expiresIn: expires })
  }
}
