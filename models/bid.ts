const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidSchema = new Schema({
  value: {
    type: Number,
  },
  description: { type: String },
  lockedOn: { type: String },
  state: { type: String, default: "Under Review" },
  class: { type: String, default: "btn-under-review" },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Bid", BidSchema);
