const mongoose = require ('mongoose')
const cities = require ('./cities')
const {places,descriptors} = require ('./seedHelpers')
const campGround = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection error"));
db.once('open',function(){
    console.log("Database Connected")
})
const sample = (arr)=>arr[Math.floor(Math.random()*arr.length)];
const seedDB = async()=>{
    await campGround.deleteMany({})
    for (let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new campGround({
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random1000].city},${cities[random1000].state}`,
            authur : '67a0cf21806b7eb126b6487b',
            images : [
                {
                  url: 'https://res.cloudinary.com/doycg1jae/image/upload/v1740294534/YelpCamp/c46u072iojpijutmnc3b.jpg',
                  filename: 'YelpCamp/c46u072iojpijutmnc3b',
                },
                {
                  url: 'https://res.cloudinary.com/doycg1jae/image/upload/v1740294532/YelpCamp/icpuet8ptajyxncgdm0k.jpg',
                  filename: 'YelpCamp/icpuet8ptajyxncgdm0k',                }
              ],
            description : "Lorem ipsum odor amet, consectetuer adipiscing elit. Felis non aptent vivamus sagittis; pellentesque vitae lacus posuere. Nibh maximus magna netus erat fermentum eleifend finibus",
            price : price
        })
        await camp.save();
    }
}   
seedDB().then(()=>{
    mongoose.connection.close();
})

// 67a0cf21806b7eb126b6487b - My id