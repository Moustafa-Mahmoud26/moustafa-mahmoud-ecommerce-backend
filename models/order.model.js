import { Schema, model } from "mongoose";

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Order item must reference a product"],
  },
  name: {
    type: String,
    required: [true, "Order item name is required"],
  },
  price: {
    type: Number,
    required: [true, "Order item price is required"],
    min: [0, "Price cannot be negative"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
});

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
    },
  },
  { timestamps: true }
);

export default model("Order", OrderSchema, "orders");