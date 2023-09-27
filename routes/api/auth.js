const express = require('express');
const router = express.Router();
const {  login } = require('../../controllers/api/authController.js');




// Login
router.post('/auth',  login);

module.exports = router;