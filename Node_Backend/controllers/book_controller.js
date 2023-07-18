// Model location
const { bookModel } = require("../models/book_model");
const { userModel } = require("../models/user_model");

// Get all books
module.exports.getAllBooks = async (req, res) => {
  try {
    // Retrieve all books
    const books = await bookModel.find();

    // Return success response with the books data
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

// Get book by ID
module.exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const sellerId = req.params.sellerId;

    let book;

    // Check if bookId is provided
    if (bookId) {
      // Retrieve book by bookId
      book = await bookModel.findOne({ _id: bookId });
    } else if (sellerId) {
      // Retrieve books by sellerId
      book = await bookModel.find({ userId: sellerId });
    } else {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "No bookId or sellerId provided",
      });
    }

    // Check if book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Book not found",
      });
    }

    // Return success response with the book data
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

// Get book by Seller
module.exports.getBooksByRole = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const books = await bookModel.find({ userId });

    const userData = {
      seller: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contactNo: user.contactNo,
        role: user.role,
      },
      books: books,
    };

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

// Create a new book
module.exports.createBook = async (req, res) => {
  try {
    const userIdMain = req.userId;
    const { bookName, bookTitle, authorName, authorId, imageUrl } = req.body;

    if (!userIdMain) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Seller must log in",
      });
    }

    const newBook = new bookModel({
      userId: userIdMain,
      imageUrl,
      bookName,
      bookTitle,
      authorName,
      authorId,
      createdAt: Date.now(),
      updatedAt: null,
    });

    // Save the new book to the database
    await newBook.save();

    // Return success response with the newly created book data
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};

// Update a book
module.exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.userId;
    const { bookName, bookTitle, authorName, authorId, imageUrl} = req.body;

    // Find the book by ID
    const book = await bookModel.findOne({ _id: bookId });

    // Check if the book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Book not found",
      });
    }

    // Check if the user is an admin
    if (req.role === 'admin') {
      // If the user is an admin, allow updating the book
      book.imageUrl = imageUrl;
      book.bookName = bookName;
      book.bookTitle = bookTitle;
      book.authorName = authorName;
      book.authorId = authorId;
      book.updatedAt = Date.now();
    } else if (book.userId !== userId) {
      // If the user is not an admin and the book's userId is not the same as the requesting user's ID,
      // return an error indicating that the user is not authorized to update the book
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to update this book",
      });
    } else {
      // If the user is a seller and the book's userId matches the requesting user's ID,
      // allow updating the book
      book.imageUrl = imageUrl;
      book.bookName = bookName;
      book.bookTitle = bookTitle;
      book.authorName = authorName;
      book.authorId = authorId;
      book.updatedAt = Date.now();
    }

    // Save the updated book to the database
    const updatedBook = await book.save();

    // Return success response with the updated book data
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};


// Update a book partially
// Update a book partially
module.exports.patchBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;
    const userId = req.userId;

    // Find the book by ID
    const book = await bookModel.findOne({ _id: bookId });
    // Check if the book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Book not found",
      });
    }

    // Check if the user is an admin
    if (req.role === "admin") {
      // If the user is an admin, allow updating the book
      for (const key in updates) {
        book[key] = updates[key];
      }
      book.updatedAt = Date.now();
      console.log(book);
    } else if (book.userId !== userId) {
      // If the user is not an admin and the book's userId is not the same as the requesting user's ID,
      // return an error indicating that the user is not authorized to update the book
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to update this book",
      });
    } else {
      // If the user is a seller and the book's userId matches the requesting user's ID,
      // allow updating the book
      for (const key in updates) {
        book[key] = updates[key];
      }
      book.updatedAt = Date.now();
    }

    // Save the updated book to the database
    const updatedBook = await book.save();

    // Return success response with the updated book data
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};


// Delete a book
module.exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Check if book exists
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Book not found",
      });
    }

    // Delete the book from the database
    const deletedBook = await bookModel.findByIdAndRemove(bookId);

    // Return success response with the deleted book data
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    // Return error response if an error occurs
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred on the server",
    });
  }
};