const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const applications = sequelize.define('applications', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING
    },
    jobTitle: {
        type: DataTypes.STRING,
    },
    applicationDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.STRING
    },
    resume: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    coverLetter: {
        type: DataTypes.STRING,
        defaultValue: ""
    }
},
    { timestamps: false });


module.exports = applications;