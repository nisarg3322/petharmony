const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const sellerSchema = new Schema({
    email:{
        type: String,
        required:true,
        unique: true
    }

})

sellerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Seller', sellerSchema)