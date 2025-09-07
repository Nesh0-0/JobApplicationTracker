
const { applications, reminders } = require("../models/associations");
const { Op } = require("sequelize");

// GET /api/stats
const getStats = async () => {
    try {
        // Total applications
        const totalApplications = await applications.count();

        // Status counts
        const interviews = await applications.count({ where: { status: "interviewed" } });
        const offers = await applications.count({ where: { status: "offered" } });
        const rejections = await applications.count({ where: { status: "rejected" } });


        // Applications by company
        const appsByCompany = await applications.findAll({
            attributes: ["companyName", [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"]],
            group: ["companyName"],
        });

        // Reminders status
        const pendingReminders = await reminders.count({ where: { status: "pending" } });
        const sentReminders = await reminders.count({ where: { status: "sent" } });

        return {
            success: true,
            message: "Stats fetched successfully!",
            totalApplications,
            interviews,
            offers,
            rejections,
            appsByCompany,
            reminders: { pending: pendingReminders, sent: sentReminders },
        };

    } catch (err) {
        console.error(err);
        return { success: false, message: "Failed to fetch stats!", error: err };
    }
};

module.exports = { getStats };
