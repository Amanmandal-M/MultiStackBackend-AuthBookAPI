const request = require('supertest');
const app = require('../server');

describe('Book Routes', () => {
  it('should get all books', async () => {
    const response = await request(app).get('/book');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Books retrieved successfully');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should create a new book', async () => {
    const bookData = {
      imageUrl: 'https://example.com/book-image.jpg',
      userId: 'User ID',
      bookName: 'Book Name',
      bookTitle: 'Book Title',
      authorName: 'Author Name',
      authorId: 'Author ID',
    };

    const response = await request(app)
      .post('/book')
      .send(bookData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Book created successfully');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.imageUrl).toBe(bookData.imageUrl);
    expect(response.body.data.userId).toBe(bookData.userId);
    expect(response.body.data.bookName).toBe(bookData.bookName);
    expect(response.body.data.bookTitle).toBe(bookData.bookTitle);
    expect(response.body.data.authorName).toBe(bookData.authorName);
    expect(response.body.data.authorId).toBe(bookData.authorId);
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.data.updatedAt).toBeNull();
  });

  it('should get a book by ID', async () => {
    const bookData = {
      imageUrl: 'https://example.com/book-image.jpg',
      userId: 'User ID',
      bookName: 'Book Name',
      bookTitle: 'Book Title',
      authorName: 'Author Name',
      authorId: 'Author ID',
    };

    const createdBook = await request(app)
      .post('/book')
      .send(bookData);

    const response = await request(app).get(`/book/${createdBook.body.data._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Book retrieved successfully');
    expect(response.body.data._id).toBe(createdBook.body.data._id);
    expect(response.body.data.imageUrl).toBe(bookData.imageUrl);
    expect(response.body.data.userId).toBe(bookData.userId);
    expect(response.body.data.bookName).toBe(bookData.bookName);
    expect(response.body.data.bookTitle).toBe(bookData.bookTitle);
    expect(response.body.data.authorName).toBe(bookData.authorName);
    expect(response.body.data.authorId).toBe(bookData.authorId);
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.data.updatedAt).toBeNull();
  });

  it('should update a book', async () => {
    const bookData = {
      imageUrl: 'https://example.com/book-image.jpg',
      userId: 'User ID',
      bookName: 'Book Name',
      bookTitle: 'Book Title',
      authorName: 'Author Name',
      authorId: 'Author ID',
    };

    const createdBook = await request(app)
      .post('/book')
      .send(bookData);

    const updateData = {
      imageUrl: 'https://example.com/updated-image.jpg',
      bookName: 'Updated Book Name',
      bookTitle: 'Updated Book Title',
      authorName: 'Updated Author Name',
      authorId: 'Updated Author ID',
    };

    const response = await request(app)
      .put(`/book/${createdBook.body.data._id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Book updated successfully');
    expect(response.body.data._id).toBe(createdBook.body.data._id);
    expect(response.body.data.imageUrl).toBe(updateData.imageUrl);
    expect(response.body.data.bookName).toBe(updateData.bookName);
    expect(response.body.data.bookTitle).toBe(updateData.bookTitle);
    expect(response.body.data.authorName).toBe(updateData.authorName);
    expect(response.body.data.authorId).toBe(updateData.authorId);
    expect(response.body.data.updatedAt).toBeDefined();
  });

  it('should delete a book', async () => {
    const bookData = {
      imageUrl: 'https://example.com/book-image.jpg',
      userId: 'User ID',
      bookName: 'Book Name',
      bookTitle: 'Book Title',
      authorName: 'Author Name',
      authorId: 'Author ID',
    };

    const createdBook = await request(app)
      .post('/book')
      .send(bookData);

    const response = await request(app).delete(`/book/${createdBook.body.data._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Book deleted successfully');
    expect(response.body.data._id).toBe(createdBook.body.data._id);
    expect(response.body.data.imageUrl).toBe(bookData.imageUrl);
    expect(response.body.data.userId).toBe(bookData.userId);
    expect(response.body.data.bookName).toBe(bookData.bookName);
    expect(response.body.data.bookTitle).toBe(bookData.bookTitle);
    expect(response.body.data.authorName).toBe(bookData.authorName);
    expect(response.body.data.authorId).toBe(bookData.authorId);
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.data.updatedAt).toBeDefined();
  });
});
