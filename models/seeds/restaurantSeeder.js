const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const restaurantList = require('./restaurant.json').results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for(let i = 0; i < restaurantList.length; i++) {
    console.log(`add id: ${restaurantList[i]['id']} to mongodb`)
    Restaurant.create(restaurantList[i])
  } 
})


