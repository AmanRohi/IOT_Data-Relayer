const mongoose = require("mongoose")

const ipfsDataSchema = new mongoose.Schema({
    hash:String,
    temperature:Number,
    spO2:Number,
    bpm:Number,
    timestamp:Number,
});

const IpfsData = mongoose.model("ipfsData", ipfsDataSchema);

module.exports=IpfsData;

