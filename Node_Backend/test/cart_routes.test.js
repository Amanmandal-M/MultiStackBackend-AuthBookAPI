const request = require('supertest');
const app = require('../server');

describe('Cart Routes', () => {
  let token;
  beforeAll(async () => {
    // Register a new user and login to obtain the token for authenticated requests
    const registerData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNo: '1234567890',
      password: 'password123',
      role: 'customer',
    };

    await request(app)
      .post('/user/register')
      .send(registerData);

    const response = await request(app)
      .post('/user/login')
      .send({
        email: registerData.email,
        password: registerData.password,
      });

    token = response.body.token;
  });

  it('should get the cart', async () => {
    const response = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Cart retrieved successfully');
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.books).toBeDefined();
    expect(response.body.data.createdAt).toBeDefined();
  });

  it('should add a book to the cart', async () => {
    const bookData = {
      bookId: 'Book ID',
      quantity: 1,
    };

    const response = await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Book added to cart successfully');
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.books).toEqual([
      {
        _id: expect.any(String),
        bookId: bookData.bookId,
        quantity: bookData.quantity,
      },
    ]);
    expect(response.body.data.createdAt).toBeDefined();
  });

  it('should update a cart item', async () => {
    const bookData = {
      bookId: 'Book ID',
      quantity: 2,
    };

    const cartResponse = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);

    const cartId = cartResponse.body.data._id;

    const response = await request(app)
      .patch(`/cart/${cartId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Cart item updated successfully');
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.books).toEqual([
      {
        _id: expect.any(String),
        bookId: bookData.bookId,
        quantity: bookData.quantity,
      },
    ]);
    expect(response.body.data.createdAt).toBeDefined();
  });

  it('should remove a cart item', async () => {
    const cartResponse = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);

    const cartId = cartResponse.body.data._id;
    const bookId = cartResponse.body.data.books[0]._id;

    const response = await request(app)
      .delete(`/cart/${cartId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Cart item removed successfully');
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.books).toEqual([]);
    expect(response.body.data.createdAt).toBeDefined();
  });

  it('should clear the cart', async () => {
    const response = await request(app)
      .delete('/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Cart cleared successfully');
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.books).toEqual([]);
    expect(response.body.data.createdAt).toBeDefined();
  });
});
