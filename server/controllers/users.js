const userServices = require('../services/userServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

const addUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const getUserDetails = await userServices.getUser(email);
        
        // if (!getUserDetails.success) {
        //     return res.status(500).json({ success: false, message: getUserDetails.message });
        // }
        
        if (getUserDetails.details != null) {
            return res.status(400).json({ success: false, message: 'Email ID already exists!' });
        }


        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

        bcrypt.hash(password, saltRounds, async (err, encrypted) => {
            if (err) {
                console.log('Hashing error:', err);
                return res.status(500).json({ success: false, message: 'Error encrypting password' });
            }

            try {
                const createNewUser = await userServices.createUser(username, email, phone, encrypted);
                if (createNewUser.success) {
                    res.status(201).json({
                        success: true,
                        message: 'New user created successfully!',
                        data: createNewUser
                    });
                }
                else {
                    console.log(createNewUser.error);
                    throw new Error(createNewUser.message);
                    // res.status(500).json({
                    //     success: false,
                    //     message: createNewUser.message,
                    //     err: createNewUser.error
                    // });
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Error creating user' });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await userServices.getUser(email);

        if (!userDetails.success) {
            throw new Error(userDetails.message);
        }

        console.log('userDetails = ', userDetails.details.password);

        const isPasswordCorrect = await bcrypt.compare(password, userDetails.details.password);
        if (!isPasswordCorrect) {
            throw new Error('Password incorrect. Please try again.');
        }

        const token = generateToken(userDetails.details.id, userDetails.details.username);
        res.status(200).json({ success: true, message: 'Login successful.', token, details: userDetails.details });

    } catch (err) {
        console.log(err);
        res.status(401).json({ success: false, message: err.message });
    }
};


const profile = async (req, res) => {

    try {

        const id = req.userId.id;
        const response = await userServices.getUserById(id);

        if (!response.success) 
            throw new Error(response.message)

        res.status(200).json( { success: true, message: response.message, details: response.details } );
    }

    catch (err) {

        res.status(500).json( {sucess: false, message: err.message } );
    }
};


const updateProfile = async (req, res) => {

    try {

        const id = req.userId.id;

        const {updatedUser} = req.body;

        const response = await userServices.updateUser(id, updatedUser);

        res.status(200).json( { success: true, message: response.message, details: response.details } );
    }

    catch (err) {

        res.status(500).json( {sucess: false, message: err.message } );
    }
};


module.exports = { addUser, login, profile, updateProfile };
