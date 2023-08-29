const express = require('express');
const router = express.Router();
const { getUser, getAllUsers, deleteUser,  } = require('../../controllers/api/userController.js');



// Register
router.get('/user/:id', getUser);
// Login
router.get('/users', getAllUsers);
router.delete('/user', deleteUser);

module.exports = router;