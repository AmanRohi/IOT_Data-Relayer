const mongoose = require("mongoose")
const User = require("./User");

const NotificationSchema = new mongoose.Schema({
    text:String,
    User:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'},
});

const Notification = mongoose.model("notification", NotificationSchema);

module.exports=Notification;

