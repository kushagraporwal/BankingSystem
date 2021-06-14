const mongoose = require('mongoose');
const schema = mongoose.Schema;

const transferschema = new schema({
    sender:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    amount:{
        type: Number,
        required: true,
    },
    date:{
        type:Date,
        required:true
    }
});
module.exports = mongoose.model('Transaction', transferschema);