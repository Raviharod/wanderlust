const User = require("../models/user.js");
const Booking = require("../models/booking.js");

module.exports.userSignupForm = (req,res)=>{
  res.render("./users/signup.ejs");
};

module.exports.userRegistration = async(req,res, next)=>{
  try{
  let {username, email, password} = req.body;
  let newUser = new User({email, username});
  const registeredUser = await User.register(newUser, password);
  // console.log(registeredUser);
  req.login(registeredUser, (err)=>{
    if(err){
      return next();
    }
    req.flash("success", "Welcome to WanderLust");
    res.redirect("/listings");
  })
  }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginFormUser = (req,res)=>{
  res.render("./users/login.ejs");
};

module.exports.loginUser = async(req, res)=>{
  req.flash("success", "Welcome back to wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};

module.exports.deleteBooking = async(req,res)=>{
  let {id : listingId} = req.params;
  let {id : userId} = req.user;
await Booking.findOneAndDelete({listing:listingId});
res.redirect(`/listings/user/profile`);
}