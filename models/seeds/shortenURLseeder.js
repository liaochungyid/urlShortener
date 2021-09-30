const mongoose = require('mongoose')
const db = require('../../config/mongoose')
const ShortenURL = require('../shortenURL')

const seedData = [
  {
    userURL: 'https://www.google.com/', shortenURL: 'UfFVb'
  },
  {
    userURL: 'https://tw.alphacamp.co/', shortenURL: 'r0Vwj'
  },
  {
    userURL: 'https://zh-tw.facebook.com/', shortenURL: 'uwgOo'
  }
]

ShortenURL.create(seedData, (err, small) => {
  if (err) return handleError(err)
  console.log('Seed data has been loaded in database. You can use following shorten url:')
  small.forEach(url => {
    console.log(`http://localhost:3000/${url.shortenURL} --for--> ${url.userURL}`)
  })
  mongoose.disconnect()
})