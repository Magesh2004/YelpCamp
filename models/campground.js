const mongoose = require('mongoose');
const Review = require('./review')
const User = require('./user')
const schema = mongoose.Schema;

const imageSchema = schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_100')
})

const campGroundSchema = schema({
    title : String,
    images : [imageSchema],
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

