const { cartModel } = require("../models/cart_model");


module.exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await cartModel.findOne({ userId }).populate("books.bookId");

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({
        userId,
        books: [],
      });
      await cart.save();
    }

    const existingBook = cart.books.find(
      (item) => item.bookId.toString() === bookId
    );

    if (existingBook) {
      existingBook.quantity += quantity;
    } else {
      cart.books.push({ bookId, quantity });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Book added to cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

module.exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const cartId = req.params.id;
    const { bookId, quantity } = req.body;

    const cart = await cartModel.findOne({ _id: cartId, userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart not found",
      });
    }

    const cartItem = cart.books.find((item) => item._id.toString() === bookId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

module.exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const cartId = req.params.id;
    const { bookId } = req.body;

    const cart = await cartModel.findOne({ _id: cartId, userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart not found",
      });
    }

    const cartItemIndex = cart.books.findIndex(
      (item) => item._id.toString() === bookId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart item not found",
      });
    }

    cart.books.splice(cartItemIndex, 1);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Cart not found",
      });
    }

    cart.books = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};
