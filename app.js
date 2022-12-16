// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

//require express-handlebars
const exphbs = require('express-handlebars')

//require restaurant.json
const restaurantList = require('./restaurant.json').results

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurantList })
})


app.get('/restaurants/:restaurant_id', (req, res) => {
const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant })
})


app.get('/search', (req, res) => {
  const keywords = req.query.keyword
  const keyword = req.query.keyword.trim().toLowerCase()

  if (!keywords) {
    return res.redirect('/')
  }

  const restaurants = restaurantList.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword) || 
      restaurant.name_en.toLowerCase().includes(keyword) ||
      restaurant.category.includes(keyword)
  })

  if (restaurants.length === 0) {
    return res.render('wrong', { keywords })
  }

  res.render('index', { restaurantList: restaurants , keywords })
})


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})