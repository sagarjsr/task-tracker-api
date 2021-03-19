const express = require('express');
const Router = express.Router();
const cors = require('cors');
const { User } = require('../models/user');
const bodyParser = require('body-parser');
const Task = require('../models/task');
const mongoose = require('mongoose');

// // route to get posts
// app.get('/getPosts', async (req, res) => {
//     const posts = await Posts.find();
//     res.json(posts);
//  })

///// route to get posts all task
Router.get('/track', (req,res,next) => {
    let token = req.headers.authorization;
    
    User.findOne({userToken : token})
    .then(async user =>{
        console.log(user)
        if(!user) {
            return res.status(401).json({message : "Unauthorized"})
        }
        const task = await Task.find({userId:user._id});
        res.status(200).json({data:task});

    })
    .catch(err => {
        return res.status(500).json({message : "Internal Server Error"})
    });


    // .then(user => {
    //     if(!user) {
    //         return res.status(401).json({message : response["401"]})
    //     }
    //     Leads.find({userId : user._id}).sort({createdDate : -1}).limit(5)
    //     .then(lead => {
    //         return res.status(200).json({data : lead, message : response["200"]})
    //     })
    //     .catch(err => {
    //         return res.status(500).json({message : response["500"]})
    //     })

    // })
    // .catch(err => {
    //     return res.status(500).json({message : response["500"]})
    // })
});


Router.post('/track', (req, res, next) => {
    let token = req.headers.authorization;

    User.findOne({ userToken: token })
        .then(async user => {
            console.log(user)
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            let taskToInsert = {
                "text": req.body.text,
                "day": req.body.day,
                "reminder": req.body.reminder,
                "userId":user._id
            }
            const task = await Task.create(taskToInsert);
            
            res.status(200).json({ data: task });

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" })
        })
});

Router.put('/track/:id', (req, res, next) => {
    let token = req.headers.authorization;
    let queryId = req.params.id;

    User.findOne({ userToken: token })
        .then(async user => {
            console.log(user)
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            let taskToUpdate = {
                "text": req.body.text,
                "day": req.body.day,
                "reminder": req.body.reminder,
                "userId":user._id
            }
            const task = await Task.updateOne({_id : mongoose.Types.ObjectId(queryId), userId : user._id}, {
                $set : taskToUpdate
            } );
            
            res.status(200).json({ data: task });

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" })
        })
});

Router.delete('/track/:id', (req, res, next) => {
    let token = req.headers.authorization;
    let queryId = req.params.id;

    User.findOne({ userToken: token })
        .then(async user => {
            console.log(user)
            if (!user) {    
                return res.status(401).json({ message: "Unauthorized" })
            }

            const task = await Task.deleteOne({_id : mongoose.Types.ObjectId(queryId), userId : user._id});
            
            res.status(200).json({ data: task });

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" })
        })
});



module.exports = Router;