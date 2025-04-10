const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
  console.log("connected to database");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({
    ...obj,
    owner:'67e28b54e6b94f92b06568e0',
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();