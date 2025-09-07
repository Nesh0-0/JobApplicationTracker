const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companies');
const auth = require('../middleware/auth');


router.post('/addCompany', auth, companyController.createCompany);

router.get('/getCompanies', auth, companyController.getCompanies);

router.delete('/deleteCompany/:id', auth, companyController.deleteCompany);

router.put('/updateCompany', auth, companyController.updateCompany);


module.exports = router;