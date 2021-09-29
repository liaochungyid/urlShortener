const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const axios = require('axios')
const randomURL = require('./public/javascripts/randomURL.js')

require('./config/mongoose')
const ShortenURL = require('./models/shortenURL')

const app = express()
const PORT = 3000
const baseURL = 'http://localhost:3000/'

app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.warning = req.flash('warning')
  res.locals.userURL = req.flash('userURL')
  next()
})

app.get('/:shortenURL', (req, res) => {
  ShortenURL
    .findOne({ shortenURL: req.params.shortenURL })
    .lean()
    .then(url => {
      res.status(301).redirect(url.userURL)
    })
    .catch(err => {
      // console.log(err)
      req.flash('warning', `This shorten URL (${baseURL}${req.params.shortenURL}) is not in database.`)
      res.redirect('/')
    })
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const userURL = req.body.userURL.trim()
  req.flash('userURL', userURL)

  if (userURL.includes(' ')) {
    req.flash('warning', 'Input is an invalid URL.')
    return res.redirect('/')
  }

  try {
    new URL(userURL)
  } catch {
    req.flash('warning', 'Input is an invalid URL.')
    return res.redirect('/')
  }

  axios.get(userURL)
    .then(response => {
      const shortenURL = randomURL(5)
      ShortenURL.create({ userURL, shortenURL })
      if (response.status < 300) {
        return req.flash('success', shortenURL)
      }
      req.flash('warning', `success, but URL has an issue. (${response.status}: ${response.statusText})`)
    })
    .catch(err => {
      req.flash('warning', `Input is an invalid URL. (${err.response.status}: ${err.response.statusText})`)
    })
    .finally(() => res.redirect('/'))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
