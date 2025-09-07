const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const resumeScannerController = require('../controllers/resumeScanner');


router.post('/scan', auth, upload.single('resume'), resumeScannerController.processResume);




module.exports = router;