const express = require('express');
const router = express.Router();
const { createUser, login } = require('../../controllers/api/authController.js');



// Register
router.post('/register', createUser);
// Login
router.post('/auth', login);

module.exports = router;