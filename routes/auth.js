const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

require('dotenv').config();


router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  Now find the user by their email address
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(400).json({ message: "Incorrect email or password." });
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) {
        return res.status(401).json({ message: "Incorrect email or password." });
    }

    if (!process.env.JWT_PrivateKey) {
        console.log("JWT_PrivateKey not found");

    }
    const token = jwt.sign({ _id: user._id, email : user.email }, process.env.JWT_PrivateKey);
    let userUpdate = await User.updateOne({_id : user._id}, {
        $set : {
            userToken : token
        }
    })
    if(!userUpdate) {
        return res.status(500).json({message : "Something went wrong"})
    }
    
    res.status(200).json({ data: token, message: "Success" });


});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().label('Email Id').email(),
        password: Joi.string().min(5).max(255).required().label('Password')
    };

    return Joi.validate(req, schema);
}

module.exports = router;