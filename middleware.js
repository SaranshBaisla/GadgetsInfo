const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedin = (req,res,next)=>{
     if(!req.isAuthenticated()){
                req.flash("error","You must be signed in first !!");
                return res.redirect("/listings");
            }
            next(); 
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to do that !!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}