const router = require("express").Router();
const { signup, login, logout, verifyEmail } = require("../controller/auth.controller.js");

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail)
module.exports = router;