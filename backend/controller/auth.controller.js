const asyncHandler = require("../middleware/asyncHandler.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

const {
  generateVerificationToken,
} = require("../utils/generateVerificationToken.js");

const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/emails.js");
const crypto = require("crypto");

require("dotenv").config();

const signup = asyncHandler(async (request, response) => {
  const { email, password, name } = request.body;

  if (!email || !password || !name) {
    response.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return response
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  const user = User({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  await user.save();

  await sendVerificationEmail(user.email, user.verificationToken);

  response.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
  });
});

const verifyEmail = asyncHandler(async (request, response) => {
  const code = request.body.code || request.query.token;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    return response.status(400).json({
      success: false,
      message: "Invalid or expired verification code.",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpireAt = undefined;

  await user.save();

  generateTokenAndSetCookie(response, user.id);
  await sendWelcomeEmail(user.email, user.name);

  response.json({
    success: true,
    message: "Email verified successfully.",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

const resendVerificationEmail = asyncHandler(async (request, response) => {
  const { email } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    return response
      .status(400)
      .json({
        success: false,
        message: "User with this email does not exist.",
      });
  }
  if (user.isVerified) {
    return response
      .status(400)
      .json({ success: false, message: "Email is already verified." });
  }

  const verificationToken = generateVerificationToken();
  user.verificationToken = verificationToken;
  user.verificationTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  await sendVerificationEmail(user.email, user.verificationToken);

  response.json({
    success: true,
    message: "Verification email resent. Please check your inbox.",
  });
});

const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  const isValid = user && (await bcrypt.compare(password, user.password));

  if (!isValid) {
    return response
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return response.status(400).json({
      success: false,
      message: "Email not verified, Please verify your email to log in.",
    });
  }
  generateTokenAndSetCookie(response, user.id);

  user.lastLogin = new Date();
  await user.save();

  response.status(200).json({
    success: true,
    message: "Logged in successfully.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

const logout = asyncHandler(async (request, response) => {
  response.clearCookie("token");
  response.json({ success: true, message: "Logged out successfully." });
});

const forgotPassword = asyncHandler(async (request, response) => {
  const { email } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    return response.status(400).json({
      success: false,
      message: "User with this email does not exist.",
    });
  }

  // Here you would generate a password reset token and send an email
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  await sendPasswordResetEmail(
    user.email,
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`
  );

  response.json({ success: true, message: "Password reset email sent." });
});

const resetPassword = asyncHandler(async (request, response) => {
  const { token } = request.params;
  const { password } = request.body;
  console.log("token: ", token, "newpassword: ", password);
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    return response.status(400).json({
      success: false,
      message: "Invalid or expired password reset token.",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("here");
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpireAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email);
  response.json({
    success: true,
    message: "Password has been reset successfully.",
  });
});

const checkAuth = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user).select("-password");
});

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
};
