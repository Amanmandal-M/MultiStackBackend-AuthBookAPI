const { bookModel } = require('../models/book_model');
const mongoose = require('mongoose');

describe('Book Model', () => {
  beforeAll(async () => {
    // Connect to the in-memory database before running the tests
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clear all collections and close the database connection after running the tests
    await Promise.all(Object.values(mongoose.connection.collections).map(collection => collection.deleteMany()));
    await mongoose.connection.close();
  });

  it('should create a new book', async () => {
    const bookData = {
      imageUrl: 'https://example.com/book-image.jpg',
      userId: mongoose.Types.ObjectId(),
      bookName: 'Book Name',
      bookTitle: 'Book Title',
      authorName: 'Author Name',
      authorId: 'Author ID',
    };

    const book = new bookModel(bookData);
    const savedBook = await book.save();

    expect(savedBook._id).toBeDefined();
    expect(savedBook.imageUrl).toBe(bookData.imageUrl);
    expect(savedBook.userId).toEqual(bookData.userId);
    expect(savedBook.bookName).toBe(bookData.bookName);
    expect(savedBook.bookTitle).toBe(bookData.bookTitle);
    expect(savedBook.authorName).toBe(bookData.authorName);
    expect(savedBook.authorId).toBe(bookData.authorId);
    expect(savedBook.createdAt).toBeDefined();
    expect(savedBook.updatedAt).toBeNull();
  });
});
