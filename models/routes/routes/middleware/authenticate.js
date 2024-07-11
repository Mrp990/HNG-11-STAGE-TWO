const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get auth header value (Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access token not found' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
