const mongoose = require('mongoose');
const { Schema } = mongoose;

const contractTwoShema = new Schema({
    to: String,
    from: String,
    email: {
        type: String,
        unique: true
    },
    name: String,
    gasFee: Number,
    status: String,
    contractPrice: Number,
    contractProfit: Number,
    cumulativeGasUsed: Number,
    blockNumber : Number,
    blockHash : String,
    transactionHash: String,
    priceUsd: Number,
    tmp: Number,
    minWithrawalDate: Number
})

const ContractTwoModel = mongoose.model('ContractTwo', contractTwoShema);

module.exports = ContractTwoModel;