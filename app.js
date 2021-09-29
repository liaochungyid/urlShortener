const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')

const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }))
app.set('view engine', 'hbs')

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
  if (req.body.userURL === "warning") {
    req.flash('warning', "warning message")
    req.flash('userURL', req.body.userURL)
  } else if (req.body.userURL === "success")
    req.flash('success', "test message")
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
