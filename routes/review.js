const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const ExpressErrors = require("../utils/ExpressErrors");
const Listing = require("../models/listing.js");
const { isLoggedin, isAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

// Create a new review
router.post("/",isLoggedin, wrapAsync(reviewControllers.createReview));

// Delete a review
router.delete("/:reviewId",isLoggedin,isAuthor, wrapAsync(reviewControllers.deleteReview));

module.exports = router;
