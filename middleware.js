const { productSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Product = require("./models/product");
const User = require("./models/user.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/users/login");
  }
  next();
};

// module.exports.validateProduct = (req, res, next) => {
//   const { error } = productSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

// module.exports.isAuthor = async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findById(id);
//   if (!product.author.equals(req.user._id)) {
//     req.flash("error", "You do not have permission to do that!");
//     return res.redirect(`/products/${id}`);
//   }
//   next();
// };

module.exports.isRegistered = async (req, res, next) => {
  const { branch, hostel, room, contact } = req.user;
  if (branch == null && hostel == null && room == null && contact == null) {
    req.flash("error", "You have to fill these details before Continuing");
    res.redirect("/users/register");
  } else {
    next();
  }
};

// module.exports.isVerified = async (req, res, next) => {
//   const emailID = req.body.email;
//   const foundUser = await User.find({ email: emailID });
//   if (!foundUser[0].verified) {
//     req.flash("error", "Your account is not verified");
//     return res.redirect("/users/login");
//   }
//   next();
// };
