const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings); 
  res.render("./listings/index.ejs", { allListings });
  // console.log(req.user);
  // res.send("index page");
};

module.exports.showListing = async (req, res) => {
  // const {id} = req.params;
  const id = req.params.id.replace(/^:/, ""); // Removes leading colon if present
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); 
  
  const location = listing.location;
  if (!listing) {
    req.flash("error", "sorry this listing not exist!");
    res.redirect("/listings");
  }
  let weatherData = await fetch(`http://api.weatherapi.com/v1/current.json?key=636a0af3c7284b41a66151902251304&q=${location}`).then(res=>res.json());
  // console.log(req.user);
  res.render("./listings/show.ejs", { listing , weatherData});
  
};



module.exports.newFormRenderListing = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let address = req.body.listing.location;
  const response = await fetch(
    `https://geocode.maps.co/search?q=${address}&api_key=67efbfc5e7a34605177151sjca491fb`
  ); // Replace with your external API URL
  const data = await response.json();
  let lat = data[0].lat;
  let lon = data[0].lon;
  // res.json({lat, lon});
  console.log(lat);
  let url = req.file.path;
  let filename = req.file.filename;
  // const {title, description, image, price, country, location} = req.body; first way to access the data from the object
  let listing = req.body.listing; // second way to access the data(first we make the keys to each form name attribute see in )
  // console.log(listing);
  if (!listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.coordinates = [lon, lat];
  // console.log(newListing);
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.editFormRenderListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you request for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  console.log(originalImageUrl);
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // await Listing.findByIdAndUpdate(id, {...req.body.listing});
  // let listing = await Listing.findById(id);
  // if(!listing.owner._id.equals(res.locals.currUser>_id)){
  //   req.flash("error", "you don't have permission to update the message");
  //   return res.redirect(`/listings/${id}`);//return so the code below does not execute
  // }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  // console.log(deleteListing)
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};

module.exports.searchListing = async(req, res)=>{
  // res.send("searching is happened");
  let {location} = req.body;
  const allListings = await Listing.find({location:location});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.catogoryListing = async(req, res)=>{
  // res.send("searching is happened");
  let {catogory} = req.params;
  const allListings = await Listing.find({catogory:catogory});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.listingUser = async(req, res)=>{
  let {id, username, email} = req.user;
  let allListings = await Listing.find({owner:id});

  const bookings = await Booking.find({ user: id}).populate('listing'); 
  // console.log(allListings);
  res.render("./users/userProfile.ejs", {allListings, username, email, bookings});
};

module.exports.listingBookings = async(req, res)=>{
  let {id} = req.params;
  let userId = req.user._id;
  const newBooking = new Booking({
    user: userId,
    listing:id
  });

  const existId = await Booking.findOne({listing: id});
  
  if(!existId){
    await newBooking.save();
    req.flash("success", "You successfully booked your hotel");
    res.redirect(`/listings/${id}`);
  }
  else if(existId){
    req.flash("error", "You have already booked the current Destination!");
    res.redirect(`/listings/${id}`);
  };
};

