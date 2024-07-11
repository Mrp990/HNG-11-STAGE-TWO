// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ status: 'Bad request', message: 'Authentication failed' });
      }
  
      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ status: 'Bad request', message: 'Authentication failed' });
      }
  
      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      // Return success response
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
  });
  
  module.exports = router;
  