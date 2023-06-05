import express, { Request, Response, Router, NextFunction } from "express"; // importing express and types
const router: Router = express.Router(); // creating router
import mongoose, { Schema, InferSchemaType, model } from "mongoose"; // importing mongoose and types
import User from "./models/user"; // importing user model
import Product from "./models/product"; // importing product model

// exporting all the imports
export {
  express,
  Request,
  Response,
  NextFunction,
  router,
  mongoose,
  Schema,
  User,
  Product,
  InferSchemaType,
  model,
};
