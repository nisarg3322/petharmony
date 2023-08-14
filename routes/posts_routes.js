const express = require('express');
const router = express.Router();
const Post = require('../models/posts_model')


// listing all post route
router.get('/' , async(req,res) => {
    const posts = await Post.find({});
    res.render('./posts/index.ejs', {posts});

})

//creating new post routes

router.get('/new' , (req,res) => {
    res.render('./posts/new')
})

router.post('/' , async (req,res) => {
    const post = new Post(req.body.post);
    await post.save();
    res.redirect('/posts');
})

// show route for each post using _id

router.get('/:id', async (req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('./posts/show', {post});
})

// update routes for post
router.get('/:id/edit' , async(req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('./posts/edit' , {post})
})

router.put('/:id' , async(req,res) => {
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    res.redirect(`/posts/${id}`)
})

// delete route for the post
router.delete('/:id', async(req,res) => {
    
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id, {...req.body.post});
    res.redirect(`/posts`)
})


module.exports = router