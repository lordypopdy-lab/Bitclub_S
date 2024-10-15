const mongoose = require('mongoose');
const {Schema} = mongoose;

const pinChecker = new Schema({
    email: {
        type: String,
        unique: true
    },
    pin: String
})

const pinModel = mongoose.model('CheckPin', pinChecker);
module.exports = pinModel;