const express = require('express');
const userRouter = express.Router();

// Import the controller functions
const { registerController, loginController } = require('../controllers/user_controller');

// Register route
userRouter.post('/register', registerController);

// Login route
userRouter.post('/login', loginController);

module.exports = { userRouter };