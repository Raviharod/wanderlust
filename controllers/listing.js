const Listing = require("../models/listing.js");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
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
  if (!listing) {
    req.flash("error", "sorry this listing not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listings/show.ejs", { listing });
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
