const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortenURLSchema = new Schema({
  userURL: {
    type: String,
    required: true
  },
  shortenURL: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('ShortenURL', shortenURLSchema)