const { cartModel } = require('../models/cart_model');
const { userModel } = require('../models/user_model');
const mongoose = require('mongoose');

describe('Cart Model', () => {
  let userId;
  beforeAll(async () => {
    // Connect to the in-memory database before running the tests
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user for testing
    const user = new userModel({
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNo: '1234567890',
      password: 'password123',
      role: 'customer',
    });
    const savedUser = await user.save();
    userId = savedUser._id;
  });

  afterAll(async () => {
    // Clear all collections and close the database connection after running the tests
    await Promise.all(Object.values(mongoose.connection.collections).map(collection => collection.deleteMany()));
    await mongoose.connection.close();
  });

  it('should create a new cart', async () => {
    const cartData = {
      userId: userId,
      books: [],
    };

    const cart = new cartModel(cartData);
    const savedCart = await cart.save();

    expect(savedCart._id).toBeDefined();
    expect(savedCart.userId).toBe(cartData.userId);
    expect(savedCart.books).toEqual(cartData.books);
    expect(savedCart.createdAt).toBeDefined();
  });
});
