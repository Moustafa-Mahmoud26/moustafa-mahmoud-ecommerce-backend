import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const checkout = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { shippingAddress } = req.body;

  const cart = await Cart.findOne().populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  for (const item of cart.items) {
    if (!item.product.inStock || item.product.stock < item.quantity) {
      return next(new AppError(`${item.product.name} does not have enough stock`, 400));
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = await Order.create({
    orderNumber: generateOrderNumber(),
    items: orderItems,
    totalPrice,
    shippingAddress,
    status: "pending",
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: "success", message: "Order placed", data: newOrder });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("items.product");
  res.status(200).json({ status: "success", message: "Orders fetched", data: orders });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({ status: "success", message: "Order fetched", data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(req.body.status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({ status: "success", message: "Order status updated", data: order });
});