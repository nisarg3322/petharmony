const express = require('express');
const router = express.Router();
const Seller = require('../models/seller_model')
const passport = require('passport')

router.get('/register' , (req,res) => {
    res.render('./seller/register')
})

router.post('/register' , async (req,res) => {
    try{
        const{email,username ,password } = req.body;
        const seller = new Seller({username,email});
        const registeredSeller = await Seller.register(seller,password);
        req.login(registeredSeller, err => {
            if(err) return next(err);
            req.flash('success', 'Successfully registered');
            res.redirect('/')
        })
        
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/')
    }
})

module.exports = router;