const express = require('express');
const userRouter = express.Router();

// Import the controller functions
const { registerController, loginController } = require('../controllers/user_controller');

// Register route
userRouter.post('/register', registerController);

// Login route
userRouter.post('/login', loginController);

module.exports = { userRouter };

// {
//     "imageUrl":"https://th.bing.com/th?id=OIP.E2ndrBfA7QOmFJQOdzst8wHaNI&w=187&h=332&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
//     "bookName":"Bhagvad Gita",
//     "bookTitle":"Story of Mahabharat",
//     "authorName":"Balmiki",
//     "authorId":1500
//  }