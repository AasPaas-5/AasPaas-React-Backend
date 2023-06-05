const express = require("express");
const router = express.Router();
// const passport = require("passport");
// const catchAsync = require("../utils/catchAsync");
// const User = require("../models/user");
// const users = require("../controllers/users");
// const Product = require("../models/product");
const products = require("../controllers/products");
// const multer = require("multer");
// const { storage } = require("../cloudinary");
// const upload = multer({ storage });
// const {
//   isLoggedIn,
//   isAuthor,
//   validateProduct,
//   isVerified,
//   isRegistered,
// } = require("../middleware");

router.route("/").get(products.getProducts);

router.route("/eachProduct").get(products.renderProduct);
// .post(isLoggedIn, upload.array("image"), catchAsync(products.renderProduct));
// .post(
//   isLoggedIn,
//   isRegistered,
//   upload.array("images"),
//   catchAsync(isLoggedIn, isRegistered, products.renderProduct)
// );

// router.route("/topDeals").get(products.topDeal);

// router.get("/selectCategory", isLoggedIn, products.selectCategory);
// router.get(
//   "/selectCategory",
//   isLoggedIn,
//   isRegistered,
//   products.selectCategory
// );

// router
//   .route("/newProduct")
//   .get(isLoggedIn, isRegistered, products.renderNewProduct)
//   // .post(isLoggedIn, upload.array("images"), catchAsync(products.newProduct));
//   .post(
//     isLoggedIn,
//     isRegistered,
//     upload.array("images"),
//     catchAsync(isLoggedIn, isRegistered, products.newProduct)
//   );

// router
//   .route("/lockConfirmation")
//   .get(isLoggedIn, isRegistered, products.renderLock)
//   .post(isLoggedIn, isRegistered, products.LockConfirm);

// router
//   .route("/productDetails")
//   .get(isLoggedIn, isRegistered, products.productDetails);

// router.route("/report").get(isLoggedIn, isRegistered, products.report);

// router.route("/search").post(products.search);

module.exports = router;
