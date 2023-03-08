const Product = require("../models/product");
const Bid = require("../models/bid");
const User = require("../models/user");

module.exports.getProducts = async (req, res) => {
  const { count } = req.query;
  const countInt = parseInt(count, 10);
  const products = await Product.aggregate([{ $sample: { size: countInt } }]);
  res.status(200).json(products);
};

module.exports.topDeal = async (req, res) => {
  const products = await Product.find({});
  res.render("products/topDeals", { products, title: "Top Deals" });
};

module.exports.renderProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const foundProduct = await Product.findById(id).populate({
      path: "author",
    });
    res.status(200).json(foundProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// module.exports.selectCategory = async (req, res) => {
//   res.render("products/selectCategory", { title: "Select Category" });
// };

// module.exports.renderNewProduct = async (req, res) => {
//   res.render("products/newProduct", { title: "New Product" });
// };

module.exports.newProduct = async (req, res) => {
  const product = new Product(req.body.product);
  product.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  product.author = req.user._id;
  product.listedOn = new Date().toLocaleDateString();
  await product.save();

  const id = product._id;
  const user = await User.findById(req.user._id);
  user.sell.push(id);
  await user.save();
  res.redirect(`/products?id=${product._id}`);
};

module.exports.productDetails = async (req, res) => {
  let bids = [];
  const { id } = req.query;
  const product = await Product.findById(id).populate({ path: "bid" });
  const bid = product.bid;
  for (i = 0; i < bid.length; i++) {
    // const bidData = await Bid.findById(bidId[i]).populate({ path: "product" });
    bids.push(bidData);
  }

  // const bids = product.bid;
  console.log(bid);
  console.log(product);
  res.render("products/productDetail", {
    product,
    bids,
    title: "Product Details",
  });
};

// module.exports.renderLock = async (req, res) => {
//   const { id } = req.query;
//   const product = await Product.findById(id);
//   res.render("products/lockConfirmation", {
//     product,
//     title: "Confirm",
//   });
// };

module.exports.LockConfirm = async (req, res) => {
  const { bid, description } = req.body;
  const { id } = req.query;
  const userId = req.user.id;
  let prodId = [];

  const foundUser = await User.findById(userId).populate({ path: "bid" });

  // if (foundUser.bid.length === 0) {
  //   // bid data
  //   const bidData = new Bid({
  //     value: bid,
  //     description: description,
  //     product: id,
  //     user: userId,
  //   });
  //   bidData.lockedOn = new Date().toLocaleDateString();
  //   await bidData.save();

  //   // product
  //   const product = await Product.findById(id);
  //   const pushproductBid = await Bid.find({ product: id });

  //   // add unique
  //   pushproductBid.forEach((item) => {
  //     if (product.bid.indexOf(item) === -1) {
  //       product.bid.push(item);
  //     }
  //   });

  //   product.lockedBy.push(req.user._id);
  //   //  product closed

  //   //user
  //   const user = await User.findById(userId);
  //   const pushUserBid = await Bid.find({ user: userId });

  //   // add unique
  //   pushUserBid.forEach((item) => {
  //     if (user.bid.indexOf(item) === -1) {
  //       user.bid.push(item);
  //     }
  //   });

  //   user.buy.push(id);
  //   // user closed

  //   //save
  //   await user.save();
  //   await product.save();

  //   //route
  //   req.flash("success", "You have locked this product");
  //   return res.redirect(`/products?id=${id}`);
  // }

  for (i = 0; i < foundUser.bid.length; i++) {
    let prod = await Product.findById(foundUser.bid[i].product._id);
    prodId.push(prod.id);
  }

  if (!prodId.includes(id)) {
    // bid data
    const bidData = new Bid({
      value: bid,
      description: description,
      product: id,
      user: userId,
    });
    bidData.lockedOn = new Date().toLocaleDateString();
    await bidData.save();

    // product
    const product = await Product.findById(id);
    // const pushproductBid = await Bid.find({ product: id });

    // add unique
    // pushproductBid.forEach((item) => {
    //   if (product.bid.indexOf(item) === -1) {
    //     product.bid.push(item);
    //   }
    // });

    product.bid.push(bidData);
    product.lockedBy.push(req.user._id);
    //  product closed

    //user
    const user = await User.findById(userId);
    // const pushUserBid = await Bid.find({ user: userId });

    // add unique
    // pushUserBid.forEach((item) => {
    //   if (user.bid.indexOf(item) === -1) {
    //     user.bid.push(item);
    //   }
    // });

    user.bid.push(bidData);

    user.buy.push(id);
    // user closed

    //save
    await user.save();
    await product.save();

    //route
    req.flash("success", "You have locked this product");
    return res.redirect(`/products?id=${id}`);
  } else {
    req.flash("error", "You have already locked this product before");
    return res.redirect(`/products?id=${id}`);
  }
};

// module.exports.report = async (req, res) => {
//   const { id } = req.query;
//   const product = await Product.findById(id);
//   res.render("products/reportProduct", { product, title: "Report!!" });
// };

// module.exports.search = async (req, res) => {
//   const search = req.body.search;
//   const products = await Product.findOne({});
//   res.render("products/search", { search, products, title: "Search" });
// };
