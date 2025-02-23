if(process.env.NODE_ENV!== "production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require ('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const campGround = require('./models/campground');
const Review = require('./models/review')
const catchAsync = require('./utils/catchAsync');
const {campgroundSchema,reviewSchema} = require('./schema')
const ExpressError = require('./utils/ExpressError')
const joi = require('joi');
const { title } = require('process');
const { descriptors } = require('./seeds/seedHelpers');
const review = require('./models/review');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localPassport = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')


const campGroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review')
const userRoute = require('./routes/user')

app.listen(8000,()=> console.log('Server running on port 8000'));

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(mongoSanitize())

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection error"));
db.once('open',function(){
    console.log("Database Connected")
})

const sessionConfig = {
    secret : "Thereisasecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now()+1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campground',campGroundRoute)
app.use('/campground/:id/review',reviewRoute)
app.use('/',userRoute)
app.get('/',catchAsync(async(req,res)=>{
    res.render('campground/home')
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if(!err.message)err.message = "Something went wrong"
    res.status(statusCode).render('error',{err});
});

