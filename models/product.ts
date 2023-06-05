import { Schema, model, InferSchemaType } from "../import";

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// ImageSchema.virtual("sizing").get(function () {
//   return this.url.replace(
//     "/upload",
//     "/upload/w_183,h_178/q_auto:good/fl_any_format"
//   );
// });

// ImageSchema.virtual("Eachsizing").get(function () {
//   return this.url.replace(
//     "/upload",
//     "/upload/w_360,h_302/q_auto:good/fl_any_format"
//   );
// });

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  listedOn: {
    type: String,
  },
  reports: {
    type: Number,
    default: 0,
  },
  bid: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  lockedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  images: [ImageSchema],
});

// CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
//   return `
//     <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`;
// });

// CampgroundSchema.post("findOneAndDelete", async function (campground) {
//   if (campground.reviews) {
//     await Review.deleteMany({
//       _id: { $in: campground.reviews },
//     });
//   }
//   if (campground.images) {
//     for (const img of campground.images) {
//       await cloudinary.uploader.destroy(img.filename);
//     }
//   }
// });

type Product = InferSchemaType<typeof ProductSchema>;

export default model<Product>("Product", ProductSchema);
