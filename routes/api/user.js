const express = require('express');
const router = express.Router();
const { getUserProfile, getAllUsers, deleteUser,  } = require('../../controllers/api/userController.js');



// Get User
router.get('/user', getUserProfile);
// Login
router.get('/users', getAllUsers);
router.delete('/user', deleteUser);

module.exports = router;