const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    email: String,
    privateKey: String,
    walletAddress: String
})

const BNBWallet = mongoose.model("BinanceWallet", walletSchema);

module.exports = BNBWallet;