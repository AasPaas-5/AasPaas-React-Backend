const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const OTP = require("../controllers/OTP");
const {
  isLoggedIn,
  isAuthor,
  validateProduct,
  isVerified,
  isRegistered,
} = require("../middleware");

router.route("/register").post(catchAsync(users.register));

router.route("/login").post(catchAsync(users.login));

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureFlash: true,
//     failureRedirect: "/users/login",
//     failureMessage: true,
//     keepSessionInfo: true,
//   }),
//   users.gLogin
// );

// router.get("/logout", isLoggedIn, users.logout);

// router.get("/profile", isLoggedIn, isRegistered, users.profilePage);

// router.route("/contact").get(users.renderContact).post(users.contact);

// router.get("/sell", isLoggedIn, isRegistered, users.sell);

// router
//   .route("/edit")
//   .get(isLoggedIn, users.renderEdit)
//   .post(isLoggedIn, users.editDetails);

// router
//   .route("/delete")
//   .get(isLoggedIn, users.deleteOne)
//   .post(isLoggedIn, users.RenderOTPDel);

// router
//   .route("/deleteFinal")
//   .get(isLoggedIn, users.finalDeleteRender)
//   .post(users.finalDelete);

// router.route("/verifyOTP").get(OTP.renderOTP).post(OTP.verifyOTP);

// router.route("/orders").get(isLoggedIn, users.orders);

// router.route("/listedProducts").get(isLoggedIn, users.listedProduct);

// router.route("/addToWishlist").get(isLoggedIn, users.addToWishlist);

// router.route("/wishlist").get(isLoggedIn, users.wishlist);

module.exports = router;
