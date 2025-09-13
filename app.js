if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash =  require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// Routers
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js"); 

const dbURL = process.env.ATLASDB_URL;

// MongoDB connection
main().catch(err => console.log("MongoDB connection error:", err));
async function main() {
  await mongoose.connect(dbURL);
  console.log("✅ Connected to MongoDB");
}



// View engine + middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*60*60
});

store.on("error", (err)=> {
    console.log("Session store error", err);
  })

const sessionOptions = {
  store:store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized:false,
  cookie: {
    httpOnly : true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

app.get("/", (req, res) => {
  res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser =  req.user;
  next();
})




// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);



// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

// Start server
app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
