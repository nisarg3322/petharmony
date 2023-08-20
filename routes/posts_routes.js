const express = require('express');
const router = express.Router();
const Post = require('../models/posts_model');
const catchAsync = require('../utils/catchAsync');
const {validatePost, isLoggedIn, isAuthor} = require('../middleware')

// listing all post route
router.get('/' , async(req,res) => {
    const posts = await Post.find({});
    res.render('./posts/index.ejs', {posts});

})



//creating new post routes

router.get('/new' , isLoggedIn, (req,res) => {
    
    res.render('./posts/new')
})

router.post('/' , isLoggedIn, validatePost, catchAsync(async (req,res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    
    await post.save();
    
    req.flash('success', 'Successfully created a new post')
    res.redirect(`/posts/${post._id}`);
}))

// show route for each post using _id

router.get('/:id', catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('./posts/show', {post});
}))

// update/edit routes for post
router.get('/:id/edit' , isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const post = await Post.findById(req.params.id);
    req.flash('success' , 'Successfully edited the post')
    res.render('./posts/edit' , {post})
}))

router.put('/:id' , isLoggedIn, isAuthor, validatePost, catchAsync(async(req,res) => {
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    req.flash('success' , 'Successfully updated the post')

    res.redirect(`/posts/${id}`)
}))


// delete route for the post
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id, {...req.body.post});
    req.flash('success' , 'Successfully deleted the post')

    res.redirect(`/posts`)
}))


module.exports = router