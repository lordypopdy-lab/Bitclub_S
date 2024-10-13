const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    email: {
        type: String
    },
    For: String,
    message: String,
    header: String,
    timestamp: Number
})

const notificationModel = mongoose.model("NotificationModel", notificationSchema);

module.exports = notificationModel;