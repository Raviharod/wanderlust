
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require('../controllers/listing.js');

router.get('/', wrapAsync(listingController.index))

module.exports = router;