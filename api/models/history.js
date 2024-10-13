const mongoose = require('mongoose');
const {Schema} = mongoose;

const historySchema = new Schema({
    email: String,
    type: String,
    Status: String,
    valueEth: Number,
    valueUsd: Number,
    timestamp: Number
})

const historyModel = mongoose.model('history', historySchema);
module.exports = historyModel;