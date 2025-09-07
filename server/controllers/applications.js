const appliationServices = require('../services/applicationServices');


const addApplication = async (req, res) => {

    try {

        const userId = req.userId.id
        const { companyName, jobTitle, applicationDate, status, notes} = req.body;
        const file = req.file;
        const response = await appliationServices.createApplication(companyName, jobTitle, applicationDate, status, notes, userId, file);

        if (!response.success) 
            throw new Error(response.message);

        res.status(201).json({ success: true, message: response.message, details: response.details });
    }

    catch (err) {

        console.log(err);
        res.status(500).json({ success: false, message: err.message});

    }
};


const getApplications = async (req, res) => {

    try {

        const userId = req.userId.id;

        let { entries, page } = req.query;

        entries = parseInt(entries, 10);
        page = parseInt(page, 10);

        const response = await appliationServices.getApplicationsById(entries, page, userId);

        if (!response.success)
            throw new Error(response.message);

        res.status(200).json( { success: true, message: response.message, details: response.details } );
        
    
    }
    catch (err) {

        console.log(err);

        res.status(500).json( { success: false, message: err.message } );
    }
};



const getApplicationsCount = async (req, res) => {

    try {

        const userId = req.userId.id;

        const response = await appliationServices.getAppliationCount(userId);

        if (!response.success) 
            throw new Error(response.message);

        res.status(200).json( { success: true, message: response.message, count: response.details });
    }

    catch (err) {

        console.log(err);

        res.status(500).json( { success: false, message: err.message } );
    }
};


const deleteApplication = async (req, res) => {

    try {

        const { id } = req.params;

        const response = await appliationServices.deleteApplicationById(id);

        if (!response.success)
            throw new Error(response.message)
        
        res.status(200).json( { success: true, message: response.message});;
    }

    catch (err) {

        console.log(err);

        res.status(500).json( { success: false, message: err.message } );
    }
};


const downloadResume = async (req, res) => {

    try {

        const {id} = req.query;

        const response = await appliationServices.getResume(id);

        if (!response.success)
            throw new Error(response.message)
        
        res.status(200).json( { success: true, message: response.message, download: response.details });;

    }

    catch (err) {

        console.log(err);

        res.status(500).json( { success: false, message: err.message } );
    }
};


const editApplication = async (req, res) => {

    try {

        const {id} = req.params;
        const {updatedData} = req.body;

        console.log('details: ', updatedData);
        const response = await appliationServices.updateApplication(id, updatedData);

        if (!response.success)
            throw new Error(response.message)

        res.status(200).json( { success: true, message: response.message, details: response.details });
    }

    catch (err) {

        res.status(500).json( { success: false, message: err.message });
    }
};

module.exports = { addApplication, getApplications, getApplicationsCount, deleteApplication, downloadResume, editApplication };