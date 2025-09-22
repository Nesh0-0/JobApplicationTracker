const { messages } = require('../models/associations');
const groupServices = require('../services/groupServices');


const createGroup = async (req, res) => {

    try {

        const { groupName } = req.body;
        const response = await groupServices.createGroup(groupName);
        if (!response.success) {
            throw new Error(response.message);
        }
        res.status(200).json({ success: true, message: response.message, details: response.details });
    }

    catch (err) {

        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};



const getGroups = async(req, res) => {

    try {

        const response = await groupServices.getGroups();
        if (!response.success) {
            throw new Error(response.message);
        }
        res.status(200).json({ success: true, message: response.message, details: response.details });
    }

    catch (err) {

        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { createGroup, getGroups };