const jwt = require("jsonwebtoken");

const generateToken = (userData) => {
  const payload = {
    id: userData.id,
    email: userData.email,
    // Add issued at time for tracking
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: "1h" });
};

module.exports = { generateToken };