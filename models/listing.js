const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },  
  price: { type: Number, required: true },
  launchDate: { type: String },
  category: { 
  type: String, 
  required: true,
  enum: [
    'Smartphone', 
    'Laptop', 
    'Headphones',
    'Smartwatch',
    'Gaming Console',
    'Smart TV',
    'Tablet',
    'Camera',
    'Speaker',
    'Monitor'
  ]
},
  images:{
    url: String,
    filename : String
  },
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  specScore: { type: Number },  // ✅ NEW
 specs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // allows objects or strings
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
