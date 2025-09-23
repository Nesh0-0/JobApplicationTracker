const { messages } = require('../models/associations');
const groupServices = require('../services/groupServices');
// const { io } = require('../app');


const createGroup = async (req, res) => {

    try {

        const { groupName } = req.body;
        const userId = req.userId.id;
        const response = await groupServices.createGroup(groupName, userId);
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


const deleteGroup = async(req, res) => {

    try {

        const { groupId } = req.params;
        const response = await groupServices.deleteGroup(groupId);
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


module.exports = { createGroup, getGroups, deleteGroup };