import { Schema, model } from "mongoose";

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Cart item must reference a product"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

const CartSchema = new Schema(
  {
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price cannot be negative"],
    },
  },
  { timestamps: true }
);

export default model("Cart", CartSchema, "carts");