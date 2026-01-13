const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required().messages({"any.required": "Name is required"}),
    email: Joi.string().email().required().messages({"any.required": "Valid email is required"}),
    password: Joi.string().min(8).required().messages({"any.required": "Password must be at least 8 characters long"}),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({"any.required": "Valid email is required"}),
    password: Joi.string().required().messages({"any.required": "Password is required"}),
});

module.exports = { userSchema, loginSchema};