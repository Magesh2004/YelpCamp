const express = require('express')
const router = express.Router();
const joi = require('joi');
const campGround = require('../models/campground');
const campground = require('../controllers/campground')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
.get(catchAsync(campground.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))

router.get('/new',campground.renderNewForm)


router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'), validateCampground ,catchAsync(campground.editCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))


module.exports = router     