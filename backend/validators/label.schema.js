const Joi = require('joi');

const createLabelSchema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
        "string.base": "Label name must be a string",
        "string.empty": "Label name cannot be empty",
        "any.required": "Label name is required"
    }),
    color: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().messages({
        "string.pattern.base": "Color must be a valid hex code"
    }),
    isDeleted: Joi.boolean().default(false)
});

const listLabelSchema = Joi.object({});

const updateLabelSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.base": "ID must be a string",
        "string.pattern.base": "ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "ID is required"
    }),
    name: Joi.string().min(1).max(50).optional(),
    color: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional()
});

const deleteLabelSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.base": "ID must be a string",
        "string.pattern.base": "ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "ID is required"
    })
});

module.exports = { createLabelSchema, listLabelSchema, updateLabelSchema, deleteLabelSchema };