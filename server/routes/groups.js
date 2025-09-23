const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const auth = require('../middleware/auth');
const { route } = require('./users');


router.get('/getAllGroups', auth, groupsController.getGroups);

router.post('/createGroup', auth, groupsController.createGroup);

router.delete('/deleteGroup/:groupId', auth, groupsController.deleteGroup);


module.exports = router;