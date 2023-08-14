const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');

// requiring models
const Seller = require('./models/seller_model')


// Requiring routes
const postRoutes = require('./routes/posts_routes');
const sellerRoutes = require('./routes/seller_routes');

// databse mongoose connect code
mongoose.connect('mongodb://127.0.0.1:27017/petharmony')
    .then(() => {
        console.log("Mongo Connected!!!!")
    })
    .catch(err => {
        console.log("On No error");
        console.log(err);
    })


// Ejs engine load
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// middleware to run every req object
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(Seller.authenticate()));

passport.serializeUser(Seller.serializeUser());
passport.deserializeUser(Seller.deserializeUser());

// locals middleware for every req object
app.use((req, res, next) => {
    res.locals.currentUser = req.Seller;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
    
// Routers
app.get('/',(req,res) => {
    res.render('home.ejs')
})

app.use('/posts', postRoutes);
app.use('/', sellerRoutes);


// server listening code
app.listen(3000 , () => {
    console.log("Listening on 3000")
})