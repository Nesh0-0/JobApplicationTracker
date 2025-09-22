const { messages } = require('../models/associations');
const sequelize = require('../utils/db');



const addMessage = async (groupId, message, userId, username) => {

    const transaction = await sequelize.transaction();

    try {

        const response = await messages.create({groupId, message, userId, username}, {transaction});
        await transaction.commit();
        return { success: true, message: 'Message added to db!', details: response};

    }
    catch (err) {

        console.log(err);
        await transaction.rollback();
        return { success: false, message: 'Could not add message to db!', error: err };
    }
};



const getMessages = async (groupId) => {

    try {

        const response = await messages.findAll( { where: { groupId } } );
        return { success: true, message: 'Messages fetched succesfully!', details: response};
        

    }
    catch (err) {

        console.log(err);
        return { success: false, message: 'Could not fetch messages', error: err };
    }
};


module.exports = { addMessage, getMessages };