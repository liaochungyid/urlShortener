const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const axios = require('axios')
const randomURL = require('./public/javascripts/randomURL.js')

const app = express()
const urlBase = 'http://localhost'
const PORT = 3000

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

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.userURL.trim()
  req.flash('userURL', url)

  if (url.includes(' ')) {
    req.flash('warning', 'Input is an invalid URL.')
    return res.redirect('/')
  }

  try {
    new URL(url)
  } catch {
    req.flash('warning', 'Input is an invalid URL.')
    return res.redirect('/')
  }

  axios.get(req.body.userURL)
    .then(response => {
      if (response.status < 300) {
        return req.flash('success', urlBase + randomURL(5))
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
