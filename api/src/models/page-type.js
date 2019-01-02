const mongoose = require('mongoose')

const { InputSchema } = require('./input')

let PageTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    index: true
  },
  inputs: [InputSchema]
})

let PageType = mongoose.model('PageType', PageTypeSchema)

module.exports = { PageType }
