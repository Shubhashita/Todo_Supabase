const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const todoRoutes = require('./todo.routes');
const labelRoutes = require('./label.routes');
router.use('/user', userRoutes);
router.use('/todo', todoRoutes);
router.use('/label', labelRoutes);

module.exports = router;
