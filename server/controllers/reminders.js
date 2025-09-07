const reminderServices = require('../services/reminderServices');



const addReminder = async (req, res) => {

    try {

        const { jobId, reminderDate, message } = req.body;

        const response = await reminderServices.createReminder(jobId, reminderDate, message);

        if (!response.success)
            throw new Error(response.message);

        res.status(200).json({ success: true, message: response.message, details: response.details });
    }

    catch (err) {

        res.status(500).json({ success: false, message: err.message});
    }
};



module.exports = { addReminder };