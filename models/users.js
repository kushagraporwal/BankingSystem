const mongoose = require('mongoose');

const schema = mongoose.Schema;

const user = new schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    accountNumber:{
        type: Number,
        required: true,
        unique: true
    },
    currBal:{
        type: Number,
        required: true,
    }
});
module.exports = mongoose.model('User', user);