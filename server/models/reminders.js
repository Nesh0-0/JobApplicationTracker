const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');


const reminders = sequelize.define("Reminders", {
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "sent"),
      defaultValue: "pending",
    }
});

module.exports = reminders;