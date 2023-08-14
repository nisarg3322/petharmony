const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');


// Requiring routes
const postRoutes = require('./routes/posts_routes')

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
    
// Routers
app.get('/',(req,res) => {
    res.render('home.ejs')
})

app.use('/posts', postRoutes);


// server listening code
app.listen(3000 , () => {
    console.log("Listening on 3000")
})