const campGround = require('../models/campground');
const Review = require('../models/review')


module.exports.addReview = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    const review = new Review(req.body.review);
    review.authur = req.user._id
    campground.reviews.push(review);
    await campground.save();
    await review.save()
    req.flash('success','Successfully posted a review')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteReview = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await campGround.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`);    
}

