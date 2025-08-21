const { type } = require("express/lib/response");
const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);