const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const {userSchema} = require("../schema.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userControllers = require("../controllers/user.js");


router.get("/signUp",userControllers.renderSignUp);

router.post("/signup",wrapAsync(userControllers.SignUp));


router.get("/signin", userControllers.renderSignIn);

router.post("/signin",passport.authenticate("local",{failureFlash:true,failureRedirect:"/signin"}),userControllers.SignIn);


router.get("/signout",userControllers.SignOut)

module.exports = router;