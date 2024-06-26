
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')


//connection
//instead of .then and .catch i will use event emitter used with mongoose.connect
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db  = mongoose.connection;
db.on('error',console.error.bind(console, "connection error!"))
db.once('open',()=>{
    console.log("connection In!!")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const randomNum = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:"663f308d1c4322bdfa1ffa61",
            location : `${cities[randomNum].city} ,${cities[randomNum].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                  cities[randomNum].longitude,
                  cities[randomNum].latitude
                ]
              },
            title : `${sample(descriptors)} ,${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dw3uvmlbu/image/upload/v1719132517/YelpCamp/vdnsq4xslxc0awrshpkc.jpg',
                  filename: 'YelpCamp/vdnsq4xslxc0awrshpkc',
                },
                {
                  url: 'https://res.cloudinary.com/dw3uvmlbu/image/upload/v1719132517/YelpCamp/rwgesm9pgbng7ib7jmty.png',
                  filename: 'YelpCamp/rwgesm9pgbng7ib7jmty',
                }
              ],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus, repellat! Esse modi cum nam odio, libero corporis quaerat ipsa suscipit.",
            price
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})