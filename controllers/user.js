const User = require("../models/user.js");

module.exports.renderSignUp = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.SignUp = async (req,res)=>{
  try{
       let{username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Successfully signed up !");
      res.redirect("/listings");
    });
  } catch(e){
    req.flash("error", e.message);
    res.redirect("/signip")

  }
}


module.exports.renderSignIn = (req,res)=>{
    res.render("user/signin.ejs");
}

module.exports.SignIn = async(req,res)=>{
    req.flash("success", "Successfully signed in!");
    res.redirect("/listings");

}

module.exports.SignOut = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Successfully signed out!");
      res.redirect("/listings");
    })
}