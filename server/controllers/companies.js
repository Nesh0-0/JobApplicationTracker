const companyServices = require('../services/companyServices');


const createCompany = async (req, res ) => {

    try {

        const { companyData } = req.body;

        const userId = req.userId.id;

        companyData['userId'] = userId;

        console.log(companyData);

        const response = await companyServices.addCompany(companyData);

        if (!response.success)
            throw new Error(response.message);

        res.status(200).json({ success: true, message: response.message, details: response.details });
    }

    catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};


const getCompanies = async (req, res) => {

    try {

        const userId = req.userId.id;
        
        const response = await companyServices.getCompaniesByUserId(userId);

        if (!response.success) 
            throw new Error(response.message);

        res.status(200).json({ success: true, message: response.message, details: response.details });
    }
    
    catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};


const deleteCompany = async (req, res) => {

    try {

        const { id } = req.params;

        const response = await companyServices.deleteCompanyById(id);

        if (!response.success) 
            throw new Error(response.message);
        
        res.status(200).json({ success: true, message: response.message });
    }

    catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};


const updateCompany = async (req, res) => {

    try {

        const { updatedDetails } = req.body;
        
        const { id } = updatedDetails;

        const response = await companyServices.updateCompanyDetails(updatedDetails, id);

        if (!response.success)
            throw new Error(response.message);

        res.status(200).json({ success: true, message: response.message });        
    }

    catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { createCompany, getCompanies, deleteCompany, updateCompany };