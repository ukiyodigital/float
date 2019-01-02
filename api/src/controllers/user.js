let { User } = require('./../models/user')

function signup (req, res) {
  let { email, password, firstName, lastName } = req.body

  let user = new User({email, password, firstName, lastName})
  user.save().then(user => {
    return user.generateAuthToken()
  }).then(token => {
    const message = `Welcome, ${user.email}`
    res.send({
      message,
      token
    })
  }).catch(e => res.status(400).send(e))
}

function login (req, res) {
  let { email, password } = req.body

  User.findByCredentials(email, password).then(user => {
    if (!user) return Promise.reject(new Error(`Account ${email} not found. Please signup.`))
    user.generateAuthToken().then(token => {
      const message = `Welcome back, ${email}!`
      res.send({
        message,
        token
      })
    })
  }).catch(e => res.status(201).send({message: e.message}))
}

function logout (req, res) {
  req.user.removeToken(req.token).then(() => {
    const message = 'You have been logged out'
    res.status(200).send({message})
  })
}

function currentUser (req, res) {
  User.findOne({_id: req.user._id}).populate('sites').then(user => {
    res.send({user})
  })
}

module.exports = {
  signup,
  login,
  logout,
  currentUser
}
