const jwt = require('jsonwebtoken');
require('dotenv').config()
// const {users} = require('../models/associations');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(req.header());
        // console.log(token);
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("user ----> ", user);
        req.userId = user;
        console.log('Exiting middleware');
        next();
    }
    catch (err) {
        res.json({reload: true, message: `${err}`});
    }
};

module.exports = authenticate;