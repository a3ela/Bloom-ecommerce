const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler.js");
const User = require("../models/user.model.js");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized - Token failed" });
  }
});

// Placeholder for admin middleware
const admin = (req, res, next) => {

  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Forbidden - Admins only" });
  }
};

module.exports = { protect, admin };
