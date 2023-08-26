const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const Post = require('../models/posts_model')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const {storeReturnTo, isLoggedIn} = require('../middleware');


// register routes
router.get('/register' , (req,res) => {
    res.render('./user/register')
})

router.post('/register' , catchAsync(async (req,res) => {
    try{
        let{email,username ,password, firstname, lastname } = req.body.user;
        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1)
        const user = new User({username,email, firstname, lastname });
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Successfully registered');
            res.redirect('/')
        })
        
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/')
    }
}))

// login routes

router.get('/login' , (req,res) => {
    res.render('./user/login');
})

router.post('/login' , storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req,res) => {
    
    req.flash('success' , `Welcome back!! ${req.user.firstname}`);
    const redirectUrl = res.locals.returnTo || '/'
    res.redirect(redirectUrl)
})


//view all posts of a particular user

router.get('/:id/myposts' , isLoggedIn , catchAsync(async (req,res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    const posts = await Post.find({author: id});
    res.render('./user/allposts.ejs', {posts , user});
}))


//logout route
router.get('/logout' , (req,res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } else{
            req.flash('success' , 'Successfully Logged out!');
            res.redirect('/')
        }
    })
})

module.exports = router;