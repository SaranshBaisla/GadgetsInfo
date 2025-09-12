const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressErrors("Listing not found", 404);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    req.flash("success","Successfully made a new review!!");
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}


module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params; 
    req.flash("success","Successfully deleted a review!!");
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}


