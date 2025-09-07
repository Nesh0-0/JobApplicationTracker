const applications = require('../models/jobApplications');
const users = require('../models/users');
const companies = require('../models/companies');
const reminders = require('../models/reminders');



users.hasMany(applications);
applications.belongsTo(users);

users.hasMany(companies);
companies.belongsTo(users);

applications.hasMany(reminders);
reminders.belongsTo(applications);

module.exports = { applications, users, companies, reminders };