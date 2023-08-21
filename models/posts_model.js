
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user_model');

const PostSchema = new Schema({
    title:String,
    description: String,
    breed: String,
    price: Number,
    location:String,
    category: {
        type: String,
        enum: ['dog','cat','bird','rabbit','other']
    },
    images:[
        {
            url: String,
            filename: String
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  
})

module.exports = mongoose.model('Post' , PostSchema);