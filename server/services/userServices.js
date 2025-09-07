const users = require('../models/users'); 
const sequelize = require('../utils/db');




const createUser = async (username, email, phone, password) => {
    const transaction = await sequelize.transaction();
    try {
        const uploadToDB = await users.create({username, email, phone, password, status: 'offline'}, {transaction});
        await transaction.commit();
        return {success: true, details: uploadToDB};
    }
    catch (err) {
        await transaction.rollback();
        console.log(err);
        return { success: false, message: 'Error creating user', error: err };
        
    }
};



const getUser = async (email) => {
    try {
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return { success: false, message: 'User not found', details: null };
        }

        return { success: true, details: user };
    } catch (err) {
        console.error('Error fetching user:', err);
        return { success: false, message: 'Internal server error', error: err };
    }
};


const getUserById = async (id) => {

    try {

        const response = await users.findOne( { where: { id } });

        if (!response) 
            return { success: false, message: 'User not found', details: null };

        return { success: true, message: 'User detials fetched successfully!', details: response };
    }

    catch (err) {
        console.error('Error fetching user:', err);
        return { success: false, message: 'Internal server error', error: err };
    }
};


const updateUser = async(id, updatedDetails) => {

    const transaction = await sequelize.transaction();

    try {

        const response = await users.update(updatedDetails, { where: { id } }, {transaction});

        await transaction.commit();
        
        return { success: true, message: 'User details updated successfully!', details: response };
    }

    catch (err) {
        
        console.log(err);

        await transaction.rollback();

        return { success: false, message: 'Could not update user details!', error: err };

    }
};





module.exports = {getUser, createUser, getUserById, updateUser};
  