import { express, Request, Response, NextFunction } from "./import";
import { Express } from "express";
import { mongoose } from "./import";
import cors from "cors";
import path from "path";
import session from "express-session";
import methodOverride from "method-override";
import MongoDBStore from "connect-mongo";
const ejsMate = require("ejs-mate");

import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
// const Product = require("./models/product");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app: Express = express();
const dbUrl = process.env.DB_URL || "Your DB Url";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo Is Running");
  })
  .catch(() => {
    console.log("mongo error");
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const MongoStore = MongoDBStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    store: MongoStore,
    name: "session",
    secret: process.env.SECRET || "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

const logs: string[] = [];

app.use((req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const istDateTime = now.toLocaleString("en-IN");
  const logEntry = `[${istDateTime}] ${req.method} ${req.url}`;
  logs.push(logEntry);
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("home");
});

app.get("/logs", (req: Request, res: Response) => {
  res.render("log", { logs });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).render("404", { title: "Error" });
});

const port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Server Started");
});
