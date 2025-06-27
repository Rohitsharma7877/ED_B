const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
   console.log("🔐 verifyToken middleware triggered");
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded; // 👈 Must contain `id`
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
      success: false
    });
  }
};

module.exports = verifyToken;
