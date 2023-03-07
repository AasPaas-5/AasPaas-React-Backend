const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalmongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  token: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    default: null,
    // required: true,
  },
  hostel: {
    type: String,
    default: null,
    // required: true,
  },
  room: {
    type: String,
    default: null,
    // required: true,
  },
  contact: {
    type: Number,
    default: null,
    // required: true,
  },
  year: {
    type: String,
    default: null,
    // required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  bid: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  buy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  sell: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
UserSchema.plugin(passportLocalmongoose, { usernameField: "email" });

module.exports = mongoose.model("User", UserSchema);
