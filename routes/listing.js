const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
  .get(wrapAsync(listingControllers.index))
  .post(isLoggedin,upload.single('image'), wrapAsync(listingControllers.createListing));

// New listing form
router.get("/new", isLoggedin, listingControllers.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingControllers.showListing))   
  .put(isLoggedin,upload.single('image'), wrapAsync(listingControllers.updateListing))
  .delete(isLoggedin, wrapAsync(listingControllers.deleteListing));

// Edit a listing
router.get("/:id/edit", isLoggedin, wrapAsync(listingControllers.editListing));

module.exports = router;
