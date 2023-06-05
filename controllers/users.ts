const User = require("../models/user");
const Product = require("../models/product");
const Bid = require("../models/bid");
const OTP = require("./OTP");
const axios = require("axios");

// React Login
module.exports.login = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // if (req.body.googleAccessToken) {
  const { googleAccessToken } = req.body;
  axios
    .get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    })
    .then(async (response) => {
      const name = response.data.name;
      const email = response.data.email;
      const photo = response.data.picture;
      const foundUser = await User.findOne({ email });

      if (!email.includes("@itbhu.ac.in")) {
        res
          .status(210)
          .json({ message: "Login With Your College ID", status: 210 });
      } else if (!foundUser) {
        res.status(212).json({
          message: "You Need To Register First",
          status: 212,
          name,
          email,
          photo,
          token: googleAccessToken,
          id: null,
        });
      } else {
        res.status(200).json({
          message: `Welcome ${name}`,
          name,
          email,
          photo,
          token: googleAccessToken,
          id: foundUser._id,
          status: 200,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ message: "Invalid access token!!!!", status: 400 });
    });
  // }
};

module.exports.gLogin = async (req, res) => {
  emailID = req.user.email;
  const { branch, hostel, room, contact } = req.user;
  if (branch == null && hostel == null && room == null && contact == null) {
    res.redirect("/users/register");
  } else {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
};

//React Register
module.exports.register = async (req, res, next) => {
  const name = req.body.data.name.trim();
  const email = req.body.data.email.trim();
  const branch = req.body.data.branch.trim();
  const year = req.body.data.year.trim();
  const hostel = req.body.data.hostel.trim();
  const room = req.body.data.room.trim();
  const contact = req.body.data.contactNumber.trim();
  const photo = req.body.data.photo.trim();
  const token = req.body.data.token;

  if (
    !branch &&
    !hostel &&
    !room &&
    !contact &&
    !photo &&
    !name &&
    !email &&
    !year &&
    !token
  ) {
    res.status(400).json({ message: "Something Went Wrong", status: 400 });
  } else {
    const user = new User({
      name,
      email,
      branch,
      year,
      hostel,
      room,
      contact,
      photo,
      token,
    });
    await user.save();
    const id = user._id.toString();
    res
      .status(200)
      .json({ message: "Registered Successfully", id, status: 200 });
  }
  // try {
  //   const { id } = req.user;
  //   await User.findByIdAndUpdate(id, { ...req.body });
  //   res.redirect("/");
  // } catch (e) {
  //   req.flash("error", e.message);
  //   res.redirect("/users/register");
  // }
};

module.exports.logout = (req, res) => {
  // req.logout();
  // req.flash("success", "Goodbye! See You Soon");
  req.flash("success", "Goodbye! See You Soon");
  req.session.destroy();
  res.redirect("/");
};

module.exports.contact = (req, res) => {
  res.send("ok");
};

module.exports.orders = async (req, res) => {
  let bids = [];
  const bidId = req.user.bid;

  for (i = 0; i < bidId.length; i++) {
    const bidData = await Bid.findById(bidId[i]).populate({ path: "product" });
    bids.push(bidData);
  }

  res.render("users/order", { bids, title: "Your Orders" });
};

module.exports.listedProduct = async (req, res) => {
  const userId = req.user.id;
  const products = await Product.find({ author: userId }).populate({
    path: "bid",
  });
  res.render("users/listedProduct", { products, title: "Listed Products" });
};

module.exports.renderEdit = (req, res) => {
  const user = req.user;
  // res.render("users/register", { newUser, title: "Edit Info" });
  const { branch, hostel, room, contact } = req.user;
  if (
    !branch == false &&
    !hostel == false &&
    !room == false &&
    !contact == false
  ) {
    req.flash("success", "You can now edit your Info");
    res.render("users/editData", { user, title: "Edit Info" });
  } else {
    req.flash("error", "You have no registeration");
    res.redirect("/users/register");
  }
};

module.exports.editDetails = async (req, res) => {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Your details are changed");
    res.redirect("/users/profile");
  } catch (error) {
    // req.flash("error", "Something went wrong");
    req.flash("error", error.message);
    res.redirect("/users/profile");
  }
};

module.exports.RenderOTPDel = async (req, res) => {
  const id = req.user._id;
  const foundUser = await User.findById(id);
  OTP.sendOTPEmail(foundUser, res);
  res.redirect("/users/verifyOTP");
};

module.exports.finalDelete = async (req, res) => {
  const id = req.user._id;
  await User.findByIdAndDelete(id);
  res.redirect("/");
};

module.exports.addToWishlist = async (req, res) => {
  const { id } = req.query;
  const user = await User.findById(req.user._id);
  user.wishlist.push(id);
  await user.save();
  res.redirect(`/products?id=${id}`);
};

module.exports.wishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: "wishlist" });
  const wishlists = user.wishlist;
  console.log(wishlists);
  res.render("users/wishlist", { wishlists, title: "Wishlist" });
};
