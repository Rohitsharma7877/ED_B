// Middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded; // Add decoded user data to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      success: false
    });
  }
};

module.exports = verifyToken;