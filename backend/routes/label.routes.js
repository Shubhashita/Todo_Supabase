const express = require('express');
const labelController = require('../controllers/label.controller');
const { authorization } = require('../middlewares/authorize');
const { validate } = require('../validators/validate');
const { createLabelSchema, listLabelSchema, updateLabelSchema, deleteLabelSchema } = require('../validators/label.schema');
const labelRoutes = express.Router();

labelRoutes.post('/create', authorization, validate(createLabelSchema), labelController.createLabel);
labelRoutes.get('/list', authorization, validate(listLabelSchema), labelController.listLabels);
labelRoutes.put('/update/:id', authorization, validate(updateLabelSchema), labelController.updateLabel);
labelRoutes.delete('/delete/:id', authorization, validate(deleteLabelSchema), labelController.deleteLabel);

module.exports = labelRoutes;       