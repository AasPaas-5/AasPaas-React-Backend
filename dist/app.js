"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// const express = require("express");
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
// const flash = require("connect-flash");
const methodOverride = require("method-override");
const Product = require("./models/product");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const dbUrl = process.env.DB_URL || "mongodb+srv://AasPaas:FGLXePdbZCgDfyKq@aaspaas.dtckjdy.mongodb.net/?retryWrites=true&w=majority";
const MongoDBStore = require("connect-mongo");
mongoose
    .connect(dbUrl)
    .then(() => {
    console.log("Mongo Is Running");
})
    .catch(() => {
    console.log("mongo error");
});
const app = (0, express_1.default)();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(methodOverride("_method"));
app.use(express_1.default.static(path.join(__dirname, "public")));
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const Mongo_store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});
app.use(require("express-session")({
    store: Mongo_store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
// app.use(flash());
// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });
function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product.find({});
    const sortProd = yield Product.find().sort({ price: 1 });
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
}));
app.all("*", (req, res) => {
    res.status(404).render("404", { title: "Error" });
});
const port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log("Server Started");
});
