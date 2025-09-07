const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const companies = sequelize.define('companies', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING
    },
    contactDetails: {
        type: DataTypes.STRING,
    },
    industry: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.STRING
    }
},
    { timestamps: false });


module.exports = companies;