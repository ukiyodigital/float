const { User } = require('./../models/user')

const authenticate = (req, res, next) => {
  let token = req.headers.authorization

  User.findByToken(token).then(user => {
    if (!user) return res.status(400).send({message: 'Invalid token'})
    req.user = user
    req.token = token
    next()
  }).catch(e => {
    return res.status(401).send(e)
  })
}

module.exports = { authenticate }
