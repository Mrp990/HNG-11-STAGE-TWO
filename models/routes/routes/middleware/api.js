const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

// Example protected route to get user's own record
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    // Ensure only the logged-in user can access their own record
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }

    // Query the database to get user record
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Return user record
    return res.status(200).json({
      status: 'success',
      message: 'User found',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Example protected route to get user's organisations
router.get('/organisations', authenticateToken, async (req, res) => {
  try {
    // Query the database to get organisations the user belongs to
    const organisations = await Organisation.findAll({
      include: {
        model: User,
        where: { userId: req.user.userId },
        attributes: [],
        through: { attributes: [] },
      },
    });

    // Return organisations
    return res.status(200).json({
      status: 'success',
      message: 'Organisations found',
      data: {
        organisations,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
