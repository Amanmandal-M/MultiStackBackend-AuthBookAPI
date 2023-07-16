const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: String,
  bookName: String,
  bookTitle: String,
  authorName: String,
  authorId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = bookModel = mongoose.model("Book", bookSchema);