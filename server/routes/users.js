const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const auth = require('../middleware/auth');


router.post('/signup', userController.addUser);

router.post('/login', userController.login);

router.get('/profile', auth, userController.profile);

router.put('/updateProfile', auth, userController.updateProfile);


module.exports = router;