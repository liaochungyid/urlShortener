const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const routes = require('./routes')

require('./config/mongoose')

const app = express()
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
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
