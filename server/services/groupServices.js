const { groups, messages } = require('../models/associations');
const sequelize = require('../utils/db');
// const { io } = require('../app');



const createGroup = async (groupName, userId) => {

    const transaction = await sequelize.transaction();
    try {

        const response = await groups.create({groupName, userId}, {transaction});
        await transaction.commit();
        return { success: true, message: 'Created new group successfully!', details: response};
    }
    catch (err) {
        console.log(err);
        await transaction.rollback();
        return { success: false, message: 'Could not create group!', error: err};
    }
};


const getGroups = async () => {

    try {

        const response = await groups.findAll();
        return { success: true, message: 'Groups fetched successfully!', details: response };
    }

    catch (err) {
        
        console.log(err);
        return { success: false, message: 'Could not fetch groups!', error: err};
    }
};


const deleteGroup = async (groupId) => {

    const transaction = await sequelize.transaction();
    try {

        const response = await groups.destroy({where: {id: groupId}, transaction});
        // io.emit('groupDeleted', groupId);
        await transaction.commit();
        return { success: true, message: 'Group deleted successfully!', details: response };
    }

    catch (err) {
        
        console.log(err);
        await transaction.rollback();
        return { success: false, message: 'Could not delete group!', error: err};
    }

};



module.exports = { createGroup, getGroups, deleteGroup };