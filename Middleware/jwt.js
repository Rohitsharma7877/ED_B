// jwt.js
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRETKEY, {
    expiresIn: "7d"
  });
};

module.exports = { generateToken }; // ✅ note the curly braces
