const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const reviewSchema = new Schema({
    body : String,
    rating : Number,
    authur  : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = new mongoose.model('Review', reviewSchema);

