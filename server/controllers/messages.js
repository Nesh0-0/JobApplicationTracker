const messageServices = require('../services/messageServices');



const addMessage = async (req, res) => {

    try {

        const userId = req.userId.id;
        const username = req.userId.username;
        const {message, groupId} = req.body;
        const response = await messageServices.addMessage(groupId, message, userId, username);
        if (!response.success)
            throw new Error(response.message)

        res.status(200).json({ success: true, message: response.message, details: response.details });
    }
    catch (err) {

        console.log(err);
        res.status(200).json({ success: true, message: response.message });
    }
};


const getGroupMessages = async (req, res) => {

    try {

        const { groupId } = req.params;
        const response = await messageServices.getMessages(groupId);
        if (!response.success)
            throw new Error(response.message)
        res.status(200).json({ success: true, message: response.message, details: response.details });
    }
    catch (err) {

        console.log(err);
        res.status(200).json({ success: true, message: response.message });
    }
    
};



module.exports = { addMessage, getGroupMessages };