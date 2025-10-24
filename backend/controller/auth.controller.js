const asyncHandler = require("../middleware/asyncHandler.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateVerificationToken } = require("../utils/generateVerificationToken.js");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const { sendVerificationEmail, sendWelcomeEmail } = require("../mailtrap/emails.js");

require("dotenv").config();

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (request, response) => {
    const {email, password, name} = request.body;

    if (!email || !password || !name) {
        response.status(400);
        throw new Error("Please provide all required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
       return response.status(400).json({success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpireAt: Date.now() + 24 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(response, user.id);

    await sendVerificationEmail(user.email, user.verificationToken);

    response.status(201).json({ success: true, message: "User registered successfully. Please verify your email.", user: { id: user.id, name: user.name, email: user.email }});

    
});

const verifyEmail = asyncHandler(async (request, response) => {
  const { code } = request.body;

  const user = await User.findOne({ verificationToken: code, verificationTokenExpireAt: { $gt: Date.now() } });

  if (!user) {
    return response.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }
  
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpireAt = undefined;

  await user.save();

  await sendWelcomeEmail(user.email, user.name);

  response.json({ success: true, message: "Email verified successfully." });
});

const login = asyncHandler(async (request, response) => {
  res.send("Login route");
});

const logout = asyncHandler(async (request, response) => {
  response.clearCookie("token");
  response.json({ success: true, message: "Logged out successfully." });
});

module.exports = { signup, login, logout, verifyEmail };