const Joi = require('joi');

const createTodoSchema = Joi.object({
    title: Joi.string().min(3).max(500).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "any.required": "Title is required"
    }),

    description: Joi.alternatives()
        .try(Joi.string().max(300), Joi.number(), Joi.boolean(), Joi.object(), Joi.array())
        .optional(),

    status: Joi.string()
        .valid("open", "in-progress", "completed")
        .default("open")
        .messages({
            "any.only": "Status must be open, in-progress, or completed"
        }),

    label: Joi.string().min(1).max(50).optional().messages({
        "string.base": "Label must be a string",
        "string.max": "Label cannot exceed 50 characters"
    }),

    isPinned: Joi.boolean().optional(),
    isArchived: Joi.boolean().optional()
});

const listTodoSchema = Joi.object({
    status: Joi.string()
        .valid("open", "in-progress", "completed", "bin")
        .optional(),

    label: Joi.string().optional()
});

const updateTodoSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.base": "ID must be a string",
        "string.pattern.base": "ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "ID is required"
    }),

    title: Joi.string().min(3).max(500).optional().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty"
    }),

    label: Joi.string().min(1).max(50).allow(null, '').optional().messages({
        "string.base": "Label must be a string",
        "string.max": "Label cannot exceed 50 characters"
    }),

    description: Joi.alternatives()
        .try(Joi.string().max(300), Joi.number(), Joi.boolean(), Joi.object(), Joi.array())
        .optional(),

    labels: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/)).single().optional(),

    status: Joi.string()
        .valid("open", "in-progress", "completed", "bin")
        .optional()
        .messages({
            "any.only": "Status must be open, in-progress, completed, or bin"
        }),

    isPinned: Joi.boolean().optional(),
    isArchived: Joi.boolean().optional()
});

const deleteTodoSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.base": "ID must be a string",
        "string.pattern.base": "ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "ID is required"
    }),
    action: Joi.string().valid('bin', 'restore', 'permanent').optional()
});


const addLabelSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.pattern.base": "Todo ID must be a valid 24-character hex or 36-character UUID"
    }),
    labelId: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.pattern.base": "Label ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "Label ID is required"
    })
});

const removeLabelSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.pattern.base": "Todo ID must be a valid 24-character hex or 36-character UUID"
    }),
    labelId: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.pattern.base": "Label ID must be a valid 24-character hex or 36-character UUID",
        "any.required": "Label ID is required"
    })
});

const filterTodosByLabelSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$|^[0-9a-fA-F-]{36}$/).required().messages({
        "string.pattern.base": "Label ID must be a valid 24-character hex or 36-character UUID"
    })
});


module.exports = {
    createTodoSchema,
    listTodoSchema,
    updateTodoSchema,
    deleteTodoSchema,
    addLabelSchema,
    removeLabelSchema,
    filterTodosByLabelSchema
};