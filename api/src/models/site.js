const mongoose = require('mongoose')

const { Page } = require('./page')
const { Flock } = require('./flock')

const cryptos = require('crypto')

let SiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  pages: [Page.schema],
  flocks: [Flock.schema],
  token: {
    type: String,
    default: cryptos.randomBytes(32).toString('hex'),
    index: true
  },
  users: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: Number
  }]
})

SiteSchema.methods.generateAPIToken = function () {
  return cryptos.randomBytes(32).toString('hex')
}

SiteSchema.statics.findByToken = function (token) {
  return this.findOne({token})
}

SiteSchema.methods.addPage = function (page) {
  let existingPage = this.pages.find(p => p.name === page.name)
  if (existingPage) return Promise.reject(new Error(`Page ${page.name} already exists.`))

  this.pages.push(page)
  return this.save().then(() => {
    return page
  }).catch(e => Promise.reject(e))
}

SiteSchema.methods.deletePageById = function (id) {
  let page = this.pages.id(id)

  if (!page) return Promise.resolve(null)

  this.pages = this.pages.filter(p => !p._id.equals(page._id))
  return this.save().then(() => {
    return page
  })
}

SiteSchema.methods.isUniquePageSlug = function (slug) {
  let pages = this.pages.filter(page => page.slug === slug)
  return !(pages.length > 0)
}

SiteSchema.methods.addFlock = function (flock) {
  let existingFlock = this.flocks.find(f => f.name === flock.name)
  if (existingFlock) return Promise.reject(new Error(`Flock ${flock.name} already exists.`))

  this.flocks.push(flock)
  return this.save().then(() => {
    return flock
  }).catch(e => Promise.reject(e))
}

SiteSchema.methods.deleteFlockById = function (id) {
  let flock = this.flocks.id(id)

  if (!flock) return Promise.resolve(null)

  this.flocks = this.flocks.filter(f => !f._id.equals(flock._id))
  return this.save().then(() => {
    return flock
  })
}

SiteSchema.methods.isUniqueFlockSlug = function (slug) {
  let flocks = this.flocks.filter(flock => flock.slug === slug)
  return !(flocks.length > 0)
}

const Site = mongoose.model('Site', SiteSchema)

module.exports = { Site }
