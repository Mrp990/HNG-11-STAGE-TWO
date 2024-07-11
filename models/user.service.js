const User = require('../models/user.model');

class UserService {
  async createUser(firstName, lastName, email, password, phone) {
    // Logic to create user in database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    return await newUser.save();
  }

  async getUserByEmail(email) {
    // Logic to fetch user from database by email
    return await User.findOne({ email });
  }
}

module.exports = UserService;
