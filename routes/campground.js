const express = require('express')
const router = express.Router();
const joi = require('joi');
const campGround = require('../models/campground');
const {campgroundSchema} = require('../schema')
const {isLoggedIn} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
// const methodOverride = require('method-override')

const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}


router.get('/',catchAsync(async function (req,res) {

    const campgrounds  = await campGround.find({})
    res.render('campground/index',{campgrounds})
}))

router.get('/new',isLoggedIn,catchAsync(async function (req,res,next){
    res.render('campground/new')
}))

router.post('/',validateCampground,isLoggedIn,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground)throw new ExpressError("Invalid CampGround",400)
    const newCampground = new campGround(req.body.campground);
    newCampground.authur = req.user._id
    await newCampground.save();
    req.flash('success','Successfully created')
    res.redirect(`/campground/${newCampground._id}`);
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await campGround.findById(id).populate('reviews').populate('authur');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campground/show',{campground})
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
        const {id} = req.params
        const campground = await campGround.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campground');
        }
        res.render('campground/edit',{campground})
}))

router.put('/:id', validateCampground ,isLoggedIn,catchAsync(async (req,res)=>{
        const campground = await campGround.findByIdAndUpdate(req.params.id,req.body.campground);
        req.flash('success','Successfully updated')
        res.redirect(`/campground/${campground._id}`);
}))

router.delete('/:id',isLoggedIn,catchAsync(async (req,res,next)=>{
        const campground = await campGround.findByIdAndDelete(req.params.id,req.body.campground);
        res.redirect('/campground')
}))

module.exports = router