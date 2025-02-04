const express = require('express');
const router = express.Router({mergeParams:true});
const campGround = require('../models/campground');
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema,reviewSchema} = require('../schema')
const {validateReview,isLoggedIn,isReviewAuthor}= require('../middleware')



router.post('/', validateReview,isLoggedIn,catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    const review = new Review(req.body.review);
    review.authur = req.user._id
    campground.reviews.push(review);
    await campground.save();
    await review.save()
    req.flash('success','Successfully posted a review')
    res.redirect(`/campground/${campground._id}`)
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await campGround.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`);    
}))

module.exports = router;