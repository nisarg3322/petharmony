const joi = require('joi');
const {number} = require('joi');

module.exports.postSchema = joi.object({
    post: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        category: joi.string().required(),
        breed: joi.string().required(),
        price: joi.number().required().min(1),
        location: joi.string().required(),
    }).required()
})


