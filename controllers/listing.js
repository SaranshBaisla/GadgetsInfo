const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  let allListings = [];

  if (q) {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    });
  } else if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { 
    allListings, 
    category: category || null,
    searchQuery: q || ""
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // ✅ Check ownership
    const isOwner =
      req.user && req.user._id.toString() === listing.owner._id.toString();

    res.render("listings/show", { listing, currUser: req.user, isOwner });
  } catch (err) {
    console.error("Error in showListing:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};


module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    const specs = new Map();
    if (req.body.specs) {
      try {
        const specsData = JSON.parse(req.body.specs);
        if (Object.keys(specsData).length > 0) {
          specs.set("General", specsData);
        }
      } catch (error) {
        console.log("Error parsing specs:", error);
      }
    }

    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      launchDate: req.body.launchDate,
      category: req.body.category,
      specScore: req.body.specScore,
      owner: req.user._id,
      images: { url, filename },
      specs: specs
    });

    await newListing.save();
    req.flash("success", "Successfully made a new listing!!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;

    const specs = new Map();
    if (req.body.specs) {
      try {
        const specsData = JSON.parse(req.body.specs);
        if (Object.keys(specsData).length > 0) {
          specs.set("General", specsData);
        }
      } catch (error) {
        console.log("Error parsing specs during update:", error);
      }
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      launchDate: req.body.launchDate,
      category: req.body.category,
      specScore: req.body.specScore,
      specs: specs
    };

    let updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.images = { url, filename };
      await updatedListing.save();
    }

    req.flash("success", "Successfully updated listing!!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Error updating listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a listing!!");
  res.redirect("/listings");
};
