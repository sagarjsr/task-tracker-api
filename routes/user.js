const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const router = express.Router();
const { User, validate } = require('../models/user');


router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: 'That user already exisits!' });
    } else {
        // Insert the new user if they do not exist yet
        // user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);
        
        //console.log("User response is", userResp);
        //res.send().json(_.pick(user, ['_id', 'name', 'email']));
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_PrivateKey);
        let dataToInsert = {
            "name" : req.body.name,
            "email" : req.body.email,
            "password" : password,
            "userToken" : ""
        }
        let userFinal = await User.create(dataToInsert);
        if(!userFinal) {
            return res.status(500).json({message : "Server error"})
        }

        res.header('x-auth-token', token).status(200).json({ data: userFinal, message: "Success" });

        // res.status(200).json({ data: userResp, message: "Success" });
    }
});

module.exports = router;