
const { applications, reminders } = require("../models/associations");
const { Op } = require("sequelize");

// GET /api/stats
const getStats = async (id) => {
    try {
        // Total applications
        console.log('Id ----> ', id);
        const totalApplications = await applications.count({where: {userId: id}});

        // Status counts
        const interviews = await applications.count({ where: { status: "interviewed", userId: id } });
        const offers = await applications.count({ where: { status: "offered", userId: id } });
        const rejections = await applications.count({ where: { status: "rejected", userId: id } });


        // Applications by company
        const appsByCompany = await applications.findAll({
            attributes: ["companyName", [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"]],
            where: { userId: id },
            group: ["companyName"],
        });

        // Reminders status
        const pendingReminders = await reminders.count({ where: { status: "pending", userId: id } });
        const sentReminders = await reminders.count({ where: { status: "sent", userId: id } });

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
