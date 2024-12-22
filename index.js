
require('dotenv').config();
const mongoose=require("mongoose");
const express = require('express');
const { ethers } = require("ethers");
const FormData = require('form-data');
const axios  = require('axios');
const cors = require("cors");
const IpfsData = require('./models/ipfsHash');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    cors({
      origin: "*",
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    })
  )





app.post('/send_data', async (req, res) => {
  // IPFS API endpoint
  const ipfsApiUrl = 'http://127.0.0.1:5001/api/v0/add';

  // JSON data to store
  const data = req.body;
  data["timestamp"] = Date.now();
  console.log(data);

  try {
      // Create a FormData instance
      const formData = new FormData();

      // Add the JSON data as a string
      formData.append('file', JSON.stringify(data));

      // Send POST request to IPFS API
      const response = await axios.post(ipfsApiUrl, formData, {
          headers: formData.getHeaders(),
      });

      try {
        const ipfsData=new IpfsData({
          timestamp:data.timestamp,
          spO2:data.SpO2,
          temperature:data.temperature,
          hash:response.data.Hash,
          bpm:data.BPM 
        }); 

        const savedData = await ipfsData.save();
        console.log('Data Saved:', savedData);
      } catch (error) {
        console.error('Error saving user:', error);
      }

      if (response.status === 200) {
          console.log(`JSON data stored in IPFS with CID: ${response.data.Hash}`);

          res.json({ "Ipfs-Hash": response.data.Hash });

      } else {
          console.error(`Failed to upload data: ${response.statusText}`);
          res.json({ "Ipfs-Hash": "None" });
      }
  } catch (error) {
      console.error(`Error uploading data to IPFS: ${error.message}`);
      res.json({ "Ipfs-Hash": "None" });
  }
});

const PORT=3002;
app.set("port", process.env.port || 3002)
app.listen(app.get("port"), async() => {
  try{     
    console.log(`Iot Data Relayer service running on port ${PORT}`)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDbConnected`);
    }
    catch(error){
        console.log("Unsucess :"+error);
    }
});