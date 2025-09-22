const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const auth = require('../middleware/auth');


router.get('/getAllGroups', auth, groupsController.getGroups);

router.post('/createGroup', auth, groupsController.createGroup);


module.exports = router;