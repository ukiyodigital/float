const mongoose = require('mongoose')

let InputSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  slug: {
    type: String,
    trim: true,
    index: true
  },
  inputType: {
    type: String,
    required: true
  }
})

// returns flock with a new input to either a page or flock
InputSchema.methods.updateInput = function (name, slug, inputType) {

  this.name = name || this.name
  this.slug = slug || this.slug
  this.inputType = inputType || this.inputType

  return this
}

InputSchema.add({
  inputs: [InputSchema]
})

let Input = mongoose.model('Input', InputSchema)

module.exports = { Input }
