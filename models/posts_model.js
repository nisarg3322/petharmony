
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user_model');

const PostSchema = new Schema({
    title:String,
    description: String,
    category: {
        type: String,
        enum: ['dog','cat','bird','rabbit','other']
    },
    breed: String,
    price: Number,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  
})

module.exports = mongoose.model('Post' , PostSchema);