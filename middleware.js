const {postSchema} = require('./JoiSchemas');
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/posts_model')


module.exports.validatePost = (req,res,next) => {
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req,res,next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)){
        req.flash('error','You do not have permission to perform this task');
        return res.redirect('/')
    }
    next();
}