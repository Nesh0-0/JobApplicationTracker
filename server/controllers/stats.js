const statsServices = require('../services/statsServices');


const stats = async (req, res) => {

    try {

        const userId = req.userId.id;
        const response = await statsServices.getStats(userId);

        if (!response.success)
            throw new Error(response.message);

        res.status(200).json({ success: true, 
                               message: response.message, 
                               totalApplications: response.totalApplications,
                               interviews: response.interviews,
                               offers: response.offers,
                               rejection: response.rejections,
                               appsByCompany: response.appsByCompany,
                               reminders: { pending: response.reminders.pending,
                                            sent: response.reminders.sent
                                          }
        });
    }
    catch (err) {

        res.status(500).json( { success: false, message: err.message } );
    
    }
};


module.exports = { stats };