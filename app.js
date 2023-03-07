if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const Product = require("./models/product");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const dbUrl = process.env.DB_URL;
const MongoDBStore = require("connect-mongo");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo Is Running");
  })
  .catch((err) => {
    console.log("mongo error");
  });

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const Mongo_store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

app.use(
  require("express-session")({
    store: Mongo_store,
    name: "session",
    secret, //This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", async (req, res) => {
  const products = await Product.find({});
  const sortProd = await Product.find().sort({ price: 1 });
  const topDeals = sortProd.slice(0, 12);
  const recentProds = products.slice(-3);
  const trendings = getMultipleRandom(products, 3);
  const freshers = getMultipleRandom(products, 6);
  res.render("home", {
    trendings,
    freshers,
    topDeals,
    products,
    recentProds,
    title: "Home Page",
  });
});

app.all("*", (req, res, next) => {
  res.status(404).render("404", { title: "Error" });
});

const port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Server Started");
});
