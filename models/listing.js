const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { type } = require("express/lib/response.js");

const listingSchema = new Schema({
  title:{
    type: String,
    required:true
  },
  description: {
    type: String,
  },
  image: {
    // type:String,
    // default: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // set:(v)=>v===""? "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  review:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  coordinates:{
    type : [Number],
    required: true,
  },
  catogory: String
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in : listing.review}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
