const { reminders } = require('../models/associations');
const sequelize = require('../utils/db');



const createReminder = async (applicationId, reminderDate, message) => {

    const transaction = await sequelize.transaction();

    try {

        const response = reminders.create({ applicationId, reminderDate, message });

        await transaction.commit();

        return { success: true, message: 'Reminder created successfully!', details: response };
        
    }

    catch (err) {

        console.log(err);

        await transaction.rollback();

        return { success: false, message: 'Could not create reminder!', error: err };
    }
};


module.exports = { createReminder };