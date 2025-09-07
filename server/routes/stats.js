const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats');
const auth = require('../middleware/auth');


router.get('/getStats', auth, statsController.stats);




module.exports = router;