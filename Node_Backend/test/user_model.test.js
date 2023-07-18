const { userModel } = require('../models/user_model');
const mongoose = require('mongoose');

describe('User Model', () => {
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

  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNo: '1234567890',
      password: 'password123',
      role: 'customer',
    };

    const user = new userModel(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.contactNo).toBe(userData.contactNo);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeNull();
  });
});
