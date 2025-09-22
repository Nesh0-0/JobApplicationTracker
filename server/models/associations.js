const applications = require('../models/jobApplications');
const users = require('../models/users');
const companies = require('../models/companies');
const reminders = require('../models/reminders');
const messages = require('../models/messages');
const groups = require('../models/groups');



users.hasMany(applications);
applications.belongsTo(users);

users.hasMany(companies);
companies.belongsTo(users);

applications.hasMany(reminders);
reminders.belongsTo(applications);

users.hasMany(reminders);
reminders.belongsTo(users);

users.hasMany(messages);
messages.belongsTo(users);

groups.hasMany(messages);
messages.belongsTo(groups);

module.exports = { applications, users, companies, reminders, messages, groups };