const { applications } = require('../models/associations');
const sequelize = require('../utils/db');
 const AWS = require('aws-sdk');



const createApplication = async (companyName, jobTitle, applicationDate, status, notes, userId, resume) => {

    const transaction = await sequelize.transaction();
    
    try {

        const fileName = `resumes/${Date.now()}.pdf`;

        const fileUrl = await uploadToS3(resume.buffer, fileName);
        
        const details = await applications.create({ companyName, jobTitle, applicationDate, status, notes, userId, resume: fileUrl}, { transaction });

        await transaction.commit();

        return { success: true, message: "Applicated created successfully!", details };
    }

    catch (err) {

        await transaction.rollback();
        
        console.log(err);

        return { success: false, message: "Could not create new application..", error: err};

    }
};

const getApplicationsById = async (entries, page, userId) => {

    try {
        
        const limit = entries;
        const offset = (page - 1) * entries;

      

        console.log('limit ', limit);
        console.log('offset', offset);

        const details = await applications.findAll({
            where: { userId },
            limit,
            offset, 
        });

        console.log(userId);
        console.log(details);

        return { success: true, message: "Applications fetched successfully!", details };
        
    }

    catch (err) {

        console.log(err);

        return { success: false, message: "Could not fetch the appliations of the user..", error: err};
    }
}; 


const getAppliationCount = async (userId) => {

    try {

        const details = await applications.count({ where: { userId }});

        return { success: true, message: "Application count fetched successfully!", details};
    }
    
    catch (err) {

        console.log(err);

        return { success: false, message: "Could not fetch the appliations count of the user..", error: err};
    }
};



const deleteApplicationById = async (id) => {

    const transaction = await sequelize.transaction();

    try {

        const details = await applications.destroy({ where: { id }, transaction });

        await transaction.commit();

        return { success: true, message: "Deleted successfully!"};
    }

    catch (err) {

        console.log(err);

        await transaction.rollback();

        return { success: false, message: "Delete unsuccessful!", error: err};
    }
};



const uploadToS3 = (data, fileName) => {
    try {
        const s3Bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: 'ap-south-2' 
            });
        const params = {Bucket: "jobapplicationtrackeerbucket", Key: fileName, Body: data, ACL: 'public-read'};
        return new Promise((resolve, reject) => {
            
            s3Bucket.upload(params, (err, s3response) => {
                if (err) {
                    console.log('Something went wrong', err);
                    reject(err);
                }
                else {
                    console.log(s3response.Location);
                    resolve(s3response.Location);
                }
            });

        });
    }
    catch (err) {
        return err;
    }
};


const getResume = async (id) => {

    try {

        const response = await applications.findByPk(id);

        return { success: true, message: 'Resume downloaded successfully!', details: response.resume};
    }

    catch (err) {

        console.log(err);

        return { success: false, message: 'Could not download resume!', error: err };
    }
};


const updateApplication = async (id, updateDetails) => {

    const transaction = await sequelize.transaction();

    try {

        console.log(updateDetails);
        const details = await applications.update( updateDetails, { where: {id} }, { transaction });

        await transaction.commit();

        return { success: true, message: 'Updated successfully!', details }

    }

    catch (err) {

        console.log(err);

        await transaction.rollback();

        return { success: false, message: 'Update failed!', error: err };
    }
};

module.exports = { createApplication, getApplicationsById, getAppliationCount, deleteApplicationById, getResume, updateApplication };