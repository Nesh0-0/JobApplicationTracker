const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');


const messages = sequelize.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    }
});


module.exports = messages;