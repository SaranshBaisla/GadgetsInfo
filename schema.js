const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        launchDate: Joi.string().optional(),
        category: Joi.string().required(),
        images: Joi.string().allow("",null)
    }).required()
 })