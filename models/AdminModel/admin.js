const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    totalUser: Number,
    totalContractOne: Number,
    totalContractTwo: Number,
    adminName: String,
    adminEmail: String,
    totalContractProfit: Number,
    contractOnePrice: Number,
    contractTwoPrice: Number,
    marketCap: Number,
    IncreasePercent: Number
})

const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;