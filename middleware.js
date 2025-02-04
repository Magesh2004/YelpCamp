const campGround = require('./models/campground');
const Review = require('./models/review')
const {campgroundSchema,reviewSchema} = require('./schema')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const id = req.params.id
    const campground = await campGround.findById(id);
    if(!campground.authur.equals(req.user._id)){
        req.flash('error','Access Denied')
        return res.redirect(`/campground/${campground._id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id,reviewId }= req.params
    const review = await Review.findById(reviewId);
    if(!review.authur.equals(req.user._id)){
        req.flash('error','Access Denied')
        return res.redirect(`/campground/${id}`);
    }
    next();
}
