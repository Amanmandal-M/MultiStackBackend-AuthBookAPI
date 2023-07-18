const request = require('supertest');
const app = require('../server');

describe('User Routes', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNo: '1234567890',
      password: 'password123',
      role: 'customer',
    };

    const response = await request(app)
      .post('/user/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.data.name).toBe(userData.name);
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.contactNo).toBe(userData.contactNo);
    expect(response.body.data.role).toBe(userData.role);
  });

  it('should login with valid credentials', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/user/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBeDefined();
    expect(response.body.user.email).toBe(loginData.email);
    expect(response.body.user.contactNo).toBeDefined();
    expect(response.body.user.role).toBeDefined();
  });

  it('should not login with invalid credentials', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'invalidpassword',
    };

    const response = await request(app)
      .post('/user/login')
      .send(loginData);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Unauthorized');
    expect(response.body.message).toBe('Invalid credentials.');
  });
});
