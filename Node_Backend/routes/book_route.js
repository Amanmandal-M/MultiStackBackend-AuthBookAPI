const express = require("express");
const bookRouter = express.Router();

// Import the book controller
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  patchBook, // Add the patchBook controller function
} = require("../controllers/book_controller");

// Import the authorization middleware
const authorizationMiddleware = require("../middlewares/authorization_middleware");

// Define the book routes

// Accessible by all users (Customer, Seller, Admin)
bookRouter.get("/", getAllBooks);

// Accessible by all users (Customer, Seller, Admin)
bookRouter.get("/:id", getBookById);

// Routes for sellers and admins

// Accessible by sellers and admin
bookRouter.post("/", authorizationMiddleware(["seller", "admin"]), createBook);

// Accessible by sellers and admin
bookRouter.put("/:id", authorizationMiddleware(["seller", "admin"]), updateBook);

// Accessible by sellers and admin
bookRouter.patch("/:id", authorizationMiddleware(["seller", "admin"]), patchBook);

// Accessible by admin only
bookRouter.delete("/:id", authorizationMiddleware("admin"), deleteBook);


module.exports = { bookRouter };