require("dotenv").config();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { reminders, applications, users } = require("../models/associations");
const emailServices = require('../services/emailServices');
const { Op } = require("sequelize");


// Configure mailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Runs every minute
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();
        const startOfMinute = new Date(now.setSeconds(0, 0));
        const endOfMinute = new Date(startOfMinute.getTime() + 60 * 1000);

        const response = await reminders.findAll({
            where: {
                reminderDate: {
                    [Op.gte]: startOfMinute,  // reminderDate >= this minute start
                    [Op.lt]: endOfMinute      // reminderDate < next minute
                },
                status: "pending",
            },
            include: [
                {
                    model: applications,
                    include: [{ model: users }],
                },
            ],
        });


        console.log('RESPONSE -----> ', response);

        for (const reminder of response) {
            const subject = `Reminder: ${reminder.application.companyName}`;
            const htmlContent = `
        <h3>Hi ${reminder.application.user.name},</h3>
        <p>You have a reminder for your job application at <b>${reminder.application.companyName}</b>.</p>
        <p><b>Message:</b> ${reminder.message}</p>
        <p>📅 Reminder Date: ${reminder.reminderDate}</p>
        <br/>
        <p>Good luck! 🚀</p>
      `;

            const sent = await emailServices.sendEmail(reminder.application.user.email, subject, htmlContent);

            if (sent) {
                reminder.status = "sent";
                await reminder.save();
                console.log(`✅ Reminder email sent to ${reminder.application.user.email}`);
            }
        }
    } catch (err) {
        console.error("❌ Reminder scheduler failed:", err);
    }
});

