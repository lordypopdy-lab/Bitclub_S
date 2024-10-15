const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    picture: String,
    citizenId: String,
    verification: String,
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    NotificationSeen: Number
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel