const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Replace with your app entry point
const { User } = require('../models'); // Replace with your Sequelize model

chai.use(chaiHttp);
const expect = chai.expect;

describe('Token Generation', () => {
  it('should generate a valid token with correct user details', async () => {
    // Create a mock user (replace with actual user creation logic)
    const mockUser = await User.create({
      userId: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      phone: '1234567890',
    });

    // Generate token
    const token = jwt.sign(
      { userId: mockUser.userId, email: mockUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Decode token to verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assertion
    expect(decoded.userId).to.equal(mockUser.userId);
    expect(decoded.email).to.equal(mockUser.email);
  });

  it('should expire the token after the specified time', async () => {
    // Create a mock user (replace with actual user creation logic)
    const mockUser = await User.create({
      userId: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password',
      phone: '0987654321',
    });

    // Generate token with short expiry (1 second for testing)
    const token = jwt.sign(
      { userId: mockUser.userId, email: mockUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1s' }
    );

    // Wait for token to expire (replace with actual async/wait mechanism)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Attempt to verify token should throw an error
    let errorOccurred = false;
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      errorOccurred = true;
    }

    // Assertion
    expect(errorOccurred).to.be.true;
  });
});
