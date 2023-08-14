const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    email:{
        type: String,
        required:true,
        unique: true
    }

})