const User = require('../models/user')
const passport = require('passport')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async (req,res)=>{
    try{
        const{email,username,password} = req.body
        const user = new User({email,username})
        const registerUser = await User.register(user,password)
        req.login(registerUser,err=>{
            if(err){
                return next(err)
            }
            req.flash('success','Welcome to yelpcamp !')
            res.redirect('/campground')
        })
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome back');
    const redirectUrl = res.locals.returnTo || '/campground'
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req,res)=>{
    req.logOut(function(err){
        if(err){
            return next(err)
        }
        req.flash('success','Good bye !')
        res.redirect('/campground')
    })
}
