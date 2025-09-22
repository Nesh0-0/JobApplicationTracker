const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const groups = sequelize.define('groups', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    groupName: {
        type: DataTypes.STRING
    }
}, {timestamps: false})


module.exports = groups;