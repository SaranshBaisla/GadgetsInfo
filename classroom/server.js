const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path= require("path");
const flash = require("connect-flash");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser("thisismysecret"));



const sessionOptions = {
  secret: "this is a secret",
  resave: false,
  saveUninitialized: false
};

app.use(session(sessionOptions));
app.use(flash());

// Root Route
app.get("/", (req, res) => {
  res.send("This is the root");
});

app.get("/register", (req, res) => {
  let { name = "guest" } = req.query;
  req.session.name = name; // store name in session
  if(name==="guest"){
    req.flash("error","no user found")
  }else{
    req.flash("success",`welcome ${name}`);
  }
  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.render("page.ejs", {name: req.session.name}); 
})

app.listen(6060, () => {
  console.log("Server running on port 6060");
});








// app.get("/hello",(req,res)=>{
//     let {name="guest"}= req.cookies;
//     res.send(`hello ${name}`);
// });

// app.get("/signedCookies",(req,res)=>{
//   res.cookie("color", "white",{signed: true});
//   res.send("sending some signed cookies");
// });

// app.get("/verifyCookies",(req,res)=>{
//   console.log(req.signedCookies);
//   res.send("verifying cookies");
// });


// app.get("/getCookies",(req,res)=>{
//  res.cookie("name", "saransh");
//   res.send("sending some cookies");
// });

// app.get("/test",(req,res)=>{
//   res.send("test successful");
// });

// app.get("/count",(req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count=1;
//   }
//   res.send(`count = ${req.session.count}`);
// })

// // USERS ROUTES
// // ----------------------------

// // GET all users
// app.get("/users", (req, res) => {
//   res.send("All users");
// });

// // CREATE a new user
// app.post("/users", (req, res) => {
//   res.send("User created");
// });

// // SHOW a specific user by ID
// app.get("/users/:id", (req, res) => {
//   res.send("Details of user with id = " + req.params.id);
// });

// // DELETE a specific user by ID
// app.delete("/users/:id", (req, res) => {
//   res.send("Deleted user with id = " + req.params.id);
// });

// // Start Server
// app.listen(6060, () => {
//   console.log("Server is running on port 3000");
// });
