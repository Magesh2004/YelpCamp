const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchmea = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        email : true
    }
});

userSchmea.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchmea)