
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Seller = require('./seller_model');

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
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    }
  
})

module.exports = mongoose.model('Post' , PostSchema);