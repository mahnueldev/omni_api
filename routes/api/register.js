const express = require('express');
const router = express.Router();
const { createUser } = require('../../controllers/api/registerController.js');



// Register
router.post('/register', createUser);


module.exports = router;