const router = require("express").Router();
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller.js");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
module.exports = router;
