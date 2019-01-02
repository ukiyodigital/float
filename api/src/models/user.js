const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const secret = process.env.SECRET_KEY;

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 4,
    unique: true
  },
  password: {
    type: String,
    minLength: 6,
    required: true
  },
  sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  }],
  firstName: String,
  lastName: String,
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8)
    next()
  }
  next()
})

UserSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({email}).then(user => {
    if (!user) return Promise.reject(new Error('No user found'))

    return new Promise((resolve, reject) => {
      if (bcrypt.compareSync(password, user.password)) {
        resolve(user)
      } else {
        return reject(new Error('Email and password do not match.'))
      }
    })
  })
}

UserSchema.statics.findByToken = function (token) {
  let decoded

  try {
    decoded = jwt.verify(token, secret)
  } catch (e) {
    return Promise.reject(e)
  }

  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.methods.toJSON = function () {
  let userObject = this.toObject()
  const { _id, email, sites, firstName, lastName } = userObject
  return { _id, email, sites, firstName, lastName }
}

UserSchema.methods.generateAuthToken = function () {
  let access = 'auth'
  let token = jwt.sign({_id: this._id.toHexString(), access}, secret).toString()

  this.tokens.push({access, token})

  return this.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  return this.update({
    $pull: {
      tokens: {token}
    }
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = { User }
