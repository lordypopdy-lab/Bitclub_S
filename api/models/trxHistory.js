const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    name: String,
    email: {
        type: String,
    },
    amount: Number,
    to: String,
    from: String,
    blockNumber: String,
    transactionHash: String,
    status: String,
    blockHash: Number,
    gasFee: Number,
    contractProfit: Number,
    contractPrice: Number
})

const trxHistoryModel = mongoose.model('PauseLogs', transactionSchema);
module.exports = trxHistoryModel;