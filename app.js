// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})



//require restaurant.json
// const restaurantList = require('./restaurant.json').results

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//routes setting
app.get('/', (req, res) => {
  Restaurant.find()
      .lean()
      .then(restaurants => res.render('index', { restaurants }))
      .catch(error => console.log(error))
})


app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})


app.get('/search', (req, res) => {
  const keywords = req.query.keyword
  const keyword = req.query.keyword.trim().toLowerCase()

  if (!keywords) {
    return res.redirect('/')
  }

  Restaurant.find()
    .lean()
    .then(resp => {
      const restaurants = resp.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(keyword) || 
        restaurant.name_en.toLowerCase().includes(keyword) ||
        restaurant.category.includes(keyword)
      })


      res.render('index', { restaurants , keywords })
     })
    .catch(error => console.log(error))

})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})