const mongoose = require('mongoose')

const { Input } = require('./input')

let FlockSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    index: true
  },
  items: {
    type: Array
  },
  inputs: [Input.schema]
})

// returns flock with a new input to either a page or flock
FlockSchema.methods.addInput = function (name, slug, inputType) {
  const input = new Input({name, slug, inputType})
  this.inputs.push(input)

  return input
}

FlockSchema.methods.updateInput = function (iid, name, slug, inputType) {
  const input = this.inputs.id(iid)

  input.name = name || input.name
  input.slug = slug || input.slug
  input.inputType = inputType || input.inputType

  return input
}

FlockSchema.methods.removeInput = function (iid) {
  const input = this.inputs.id(iid)

  this.inputs = this.inputs.filter(input => !input._id.equals(iid))

  return input
}

// check if slug already exists
FlockSchema.methods.isUniqueInputSlug = function (slug) {
  let existingSlug = this.inputs.find(input => input.slug === slug)
  return !existingSlug
}

FlockSchema.methods.isUniqueInputName = function (name) {
  let existingName = this.inputs.find(input => input.name === name)
  return !existingName
}

FlockSchema.methods.findItemById = function (id) {
  let item = this.items.find(i => i._id.equals(id))

  return item
}

FlockSchema.methods.deleteItemById = function (id) {
  this.items = this.items.filter(item => !item._id.equals(id))

  return this.items
}

let Flock = mongoose.model('Flock', FlockSchema)

module.exports = { Flock }
