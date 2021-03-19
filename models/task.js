const mongoose = require('mongoose');
 
const Task = mongoose.model('Task', new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 250
    },
    day: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    reminder: {
        type: Boolean,
        required: true
    },
    userId:{
        type: String
    }
}));
 

 
module.exports = Task;
