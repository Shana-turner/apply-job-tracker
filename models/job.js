const mongoose = require('mongoose');
const User = require('./user');

const jobSchema = new mongoose.Schema({
    jobTitle : {
        type : String,
        required : true
    }, 
    webSite :{
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    phone : {
        type : Number, 
        required : true
    }, 
    address : {
        type : String, 
        required : true
    },
    origin : {
        type : String, 
        required : true
    },
    status : {
        type : String, 
        required : true
    },
    comments : {
        type : String, 
        required : true
    },
    user :{
        type: mongoose.Schema.Types.ObjectId, 
        required : true,
        ref : 'User'
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;