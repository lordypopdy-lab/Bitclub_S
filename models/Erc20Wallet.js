const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    email: String,
    privateKey: String,
    walletAddress: String
})

const Erc20Wallet = mongoose.model("Erc20Wallet", walletSchema);

module.exports = Erc20Wallet;