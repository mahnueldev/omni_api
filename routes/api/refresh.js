const express = require('express');
const router = express.Router();
const { handleRefreshToken  } = require('../../controllers/api/refreshController.js');



// Refresh
router.get('/refresh', handleRefreshToken );


module.exports = router;