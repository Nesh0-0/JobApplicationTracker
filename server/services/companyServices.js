const {companies} = require('../models/associations');
const sequelize = require('../utils/db');


const addCompany = async (companyDetails) => {

    const transaction = await sequelize.transaction();
    
    try { 

        console.log(companyDetails);
        
        const response = await companies.create(companyDetails, { transaction });

        await transaction.commit();

        return { success: true, message: 'Company details added successfully!', details: response };

    }
    
    catch (err) {

        console.log(err);

        await transaction.rollback();       

        return { success: false, message: 'Could not add company details!', error: err }
    }
};


const getCompaniesByUserId = async (userId) => {

    try {

        const response = await companies.findAll({ where: { userId } });

        return { success: true, message: 'Company details fetched successfully!', details: response };
    }
    catch (err) {

        console.log(err);       

        return { success: false, message: 'Could not fetch company details!', error: err };
    }
};


const deleteCompanyById = async (id) => {

    const transaction = await sequelize.transaction();

    try {

        const response = await companies.destroy( { where: { id } } );

        if (!response) 
            return { success: false, messaage: 'Could not delete company!' };

        await transaction.commit();

        return { success: true, message: 'Company deleted successfully!' };
    }
    
    catch (err) {

        console.log(err);

        await transaction.rollback();
        
        return { success: false, message: 'Could not delete company', error: err };
    }
};


const updateCompanyDetails = async (updatedDetails, id) => {

    const transaction = await sequelize.transaction();

    try {

        const response = await companies.update(updatedDetails, { where: { id } });
        
        if (!response)
            return { success: false, message: 'Could not update company details!', details: response };

        await transaction.commit();

        return { success: true, message: 'Successfully updated company details!', details: response };
    }

    catch (err) {

        console.log(err);

        await transaction.rollback();

        return { success: false, message: 'Could not update company details!', error: err };
    }
};


module.exports = { addCompany, getCompaniesByUserId, deleteCompanyById, updateCompanyDetails };