const express = require("express");
const cartRouter = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart_controller");

// Retrieve cart
cartRouter.get("/", getCart);

// Add book to cart
cartRouter.post("/", addToCart);

// Update cart item
cartRouter.patch("/:id", updateCartItem);

// Remove cart item
cartRouter.delete("/:id", removeCartItem);

// Clear cart
cartRouter.delete("/", clearCart);

module.exports = { cartRouter };