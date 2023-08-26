const express = require('express');
const router = express.Router();
const Post = require('../models/posts_model');
const catchAsync = require('../utils/catchAsync');
const {validatePost, isLoggedIn, isAuthor} = require('../middleware')
const multer = require('multer');
const {storage, cloudinary} = require('../cloudinary/index');
const { func } = require('joi');
const uploads = multer({storage});

// listing all post route
router.get('/' , async(req,res) => {
    const posts = await Post.find({});
    res.render('./posts/index.ejs', {posts});

})



//creating new post routes

router.get('/new' , isLoggedIn, (req,res) => {
    
    res.render('./posts/new')
})

router.post('/' , isLoggedIn, uploads.array('image'), validatePost, catchAsync(async (req,res) => {
    const files = req.files.map(f => ({url: f.path, filename: f.filename}))
    const post = new Post(req.body.post);
    post.images = files;
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully created a new post')
    res.redirect(`/posts/${post._id}`);
}))

// show route for each post using _id

router.get('/:id', catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id).populate('author');
    res.render('./posts/show', {post});
}))

// update/edit routes for post
router.get('/:id/edit' , isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const post = await Post.findById(req.params.id);
    
    res.render('./posts/edit' , {post})
}))

router.put('/:id' , isLoggedIn, isAuthor, uploads.array('image'), validatePost, catchAsync(async(req,res) => {
    
    const {id} = req.params
    
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({$pull: {images:{filename: {$in : req.body.deleteImages}}}})
        
    }
    req.flash('success' , 'Successfully updated the post')
    res.redirect(`/posts/${id}`)
}))


// delete route for the post
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id, {...req.body.post});
    const images = post.images;
    images.forEach(async function(img){
        filename = img.filename;
        await cloudinary.uploader.destroy(filename);
    })
    
    

    req.flash('success' , 'Successfully deleted the post')

    res.redirect(`/posts`)
}))


module.exports = router