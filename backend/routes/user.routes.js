const express = require('express');
const userController = require('../controllers/user.controller');
const { validate } = require('../validators/validate');
const userRoutes = express.Router();
const { userSchema, loginSchema } = require('../validators/user.schema');
const { authorization } = require('../middlewares/authorize');

userRoutes.post('/login', (req, res, next) => { console.log('Hit login route'); next(); }, validate(loginSchema), userController.login);
userRoutes.post('/onboard', validate(userSchema), userController.onboard);
userRoutes.put('/update-account', authorization, userController.updateAccount);
userRoutes.put('/remove-account', authorization, userController.removeAccount);
userRoutes.get('/me', authorization, userController.getProfile);
userRoutes.put('/update', authorization, userController.updateProfile);

module.exports = userRoutes;
