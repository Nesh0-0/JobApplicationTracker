const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const companyRoutes = require('./routes/companies');
const reminderRoutes = require('./routes/reminders');
const statsRoutes = require('./routes/stats');
const resumeScannerRoutes = require('./routes/resumeScanner')
// const groupRoutes = require('./routes/groups');
const db = require('./utils/db');
const cors = require('cors');
require('./utils/reminderScheduler');



app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

app.use('/users', userRoutes);

app.use('/applications', applicationRoutes);

app.use('/companies', companyRoutes);

app.use('/reminders', reminderRoutes);

app.use('/stats', statsRoutes);

app.use('/scanResume', resumeScannerRoutes);

// app.use(express.static('public'));



db.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running!`);
    });

}).catch(err => {
    console.log("Could not run server!");
});