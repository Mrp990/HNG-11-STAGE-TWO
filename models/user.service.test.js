const chai = require('chai');
const sinon = require('sinon');
const UserService = require('../services/user.service');
const User = require('../models/user.model');

const expect = chai.expect;

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      // Stubbing User model methods
      const saveStub = sinon.stub(User.prototype, 'save').returns({
        _id: '12345',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        save: saveStub,
      });

      // Mock data
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      // Create instance of UserService
      const userService = new UserService();

      // Call createUser method
      const createdUser = await userService.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.phone
      );

      // Assertions
      expect(createdUser).to.have.property('firstName', 'John');
      expect(createdUser).to.have.property('email', 'john.doe@example.com');

      // Restore stub
      saveStub.restore();
    });
  });

  describe('getUserByEmail', () => {
    it('should fetch a user by email', async () => {
      // Mock data
      const userData = {
        _id: '12345',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
      };

      // Stubbing findOne method of User model
      const findOneStub = sinon.stub(User, 'findOne').returns(userData);

      // Create instance of UserService
      const userService = new UserService();

      // Call getUserByEmail method
      const fetchedUser = await userService.getUserByEmail('jane.doe@example.com');

      // Assertions
      expect(fetchedUser).to.have.property('firstName', 'Jane');
      expect(fetchedUser).to.have.property('email', 'jane.doe@example.com');

      // Restore stub
      findOneStub.restore();
    });
  });
});
