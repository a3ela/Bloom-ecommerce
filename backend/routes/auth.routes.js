const router = require("express").Router();
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth} = require("../controller/auth.controller.js");
const {verifyToken}= require('../middleware/verifyToken.js');

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail)

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);
module.exports = router;