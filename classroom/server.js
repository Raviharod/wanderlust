const express = require("express");
const { expression } = require("joi");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let sessionOptions = {
  secret:"mytopsecret",
  resave:false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());//by writing this we can start writing our flash messages

app.use((req, res, next)=>{
  res.locals.messages = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req,res)=>{
  let {name = "anaam"} = req.query;
  req.session.name = name;
  if(name === "anaam"){
    req.flash("error", "user not found");
  }else{
    req.flash("success", "user registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
  // res.locals.messages = req.flash("success");
  // res.locals.errorMsg = req.flash("error"); //see above written in middleware
  res.render("page.ejs", {name: req.session.name});
})

app.get("/test", (req,res)=>{
  res.send("test succesful");
});


app.listen(3000, ()=>{
  console.log("app is listening on the port 3000");
});