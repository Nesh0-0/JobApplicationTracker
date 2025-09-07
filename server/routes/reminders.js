const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminders');
const auth = require('../middleware/auth');


router.post('/addReminder', auth, reminderController.addReminder);





module.exports = router;