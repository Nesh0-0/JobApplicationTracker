const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const auth = require('../middleware/auth');


router.post('/addMessage', auth, messageController.addMessage);

router.get('/getMessages/:groupId', auth, messageController.getGroupMessages);



module.exports = router;
