const mongoose = require('mongoose')

const { Input } = require('./input')

let PageSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    index: true
  },
  values: {},
  inputs: [Input.schema]
})

// returns flock with a new input to either a page or flock
PageSchema.methods.addInput = function (name, slug, inputType) {
  const input = new Input({name, slug, inputType})
  this.inputs.push(input)

  return input
}

PageSchema.methods.updateInput = function (iid, name, slug, inputType) {
  let input = this.inputs.id(iid)

  input = input.updateInput(name, slug, inputType)

  return input
}

// removes input from page array
PageSchema.methods.removeInput = function (iid) {
  const input = this.inputs.id(iid)

  this.inputs = this.inputs.filter(input => !input._id.equals(iid))

  return input
}

PageSchema.methods.isUniqueInputSlug = function (slug) {
  let existingSlug = this.inputs.find(input => input.slug === slug)
  return !existingSlug
}

PageSchema.methods.isUniqueInputName = function (name) {
  let existingName = this.inputs.find(input => input.name === name)
  return !existingName
}

let Page = mongoose.model('Page', PageSchema)

module.exports = { Page }
