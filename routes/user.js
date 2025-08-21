const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.userSignupForm) //signup form route
  .post(wrapAsync(userController.userRegistration)); //registration when form submitted

router.route("/login")
.get(userController.loginFormUser) //user login form
.post(  //login from submission
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
);

//logout route
router.get("/logout", userController.logoutUser);

//delete booking route
router.post(
  "/booking/delete/:id",
  userController.deleteBooking,
);

module.exports = router;
