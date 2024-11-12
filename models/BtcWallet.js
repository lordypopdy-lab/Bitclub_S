const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    email: String,
    privateKey: String,
    walletAddress: String
})

const BtcWallet = mongoose.model("BitcoinWallet", walletSchema);

module.exports = BtcWallet;