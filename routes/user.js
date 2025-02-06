const express = require('express')
const User = require('../models/user')
const users = require('../controllers/user')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware'); // Import middleware

router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.registerUser))

router.route('/login')
.get(users.renderLogin)
.post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginUser)

router.get('/logout',users.logoutUser)

module.exports = router