const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applications');
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/addApplication', auth, upload.single('resume'), applicationsController.addApplication);

router.get('/getApplications', auth, applicationsController.getApplications)

router.get('/count', auth, applicationsController.getApplicationsCount);

router.delete('/deleteApplication/:id', auth, applicationsController.deleteApplication);

router.get('/downloadResume', auth, applicationsController.downloadResume);

router.put('/updateApplication/:id', auth, applicationsController.editApplication);





module.exports = router;