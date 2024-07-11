const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const { User, Organisation } = require('../models');

// Validation middleware for registration fields
const validateRegistration = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

// Route for user registration
router.post('/register', validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Check if user with the same email already exists
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ errors: [{ field: 'email', message: 'Email already exists' }] });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Begin a transaction (if using Sequelize)
    const transaction = await sequelize.transaction();

    try {
      // Create a new organisation for the user
      const orgName = `${firstName}'s Organisation`;
      const organisation = await Organisation.create({ orgId: uuidv4(), name: orgName });

      // Create the user
      const newUser = await User.create({
        userId: uuidv4(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      });

      // Add user to the organisation
      await newUser.addOrganisation(organisation, { transaction });

      // Commit the transaction
      await transaction.commit();

      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: newUser.userId, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Return success response
      return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken,
          user: {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
          },
        },
      });
    } catch (err) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error(err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
