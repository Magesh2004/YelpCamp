const mongoose = require('mongoose');
const Review = require('./review')
const User = require('./user')
const schema = mongoose.Schema;

const campGroundSchema = schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    authur : {
        type:schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
    }]
}) ;

campGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('campGround',campGroundSchema);

