const express = require('express');
const router = express.Router();
const { showUser } = require('../../controllers/web/showUserController');


router.get('/',  showUser);

module.exports = router;
