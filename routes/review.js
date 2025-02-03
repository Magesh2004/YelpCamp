const express = require('express');
const router = express.Router({mergeParams:true});
const campGround = require('../models/campground');
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema,reviewSchema} = require('../schema')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}


router.post('/', validateReview,catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save()
    req.flash('success','Successfully posted a review')
    res.redirect(`/campground/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await campGround.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`);    
}))

module.exports = router;