import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("Product", ProductSchema, "products");