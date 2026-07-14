import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";

const recalculateTotal = (cart) => {
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const getOrCreateCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  await cart.populate("items.product");

  res.status(200).json({ status: "success", message: "Cart fetched", data: cart });
});

export const addItemToCart = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.inStock || product.stock < quantity) {
    return next(new AppError("Product does not have enough stock", 409));
  }

  const cart = await getOrCreateCart();

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1, price: product.price });
  }

  recalculateTotal(cart);
  await cart.save();
  await cart.populate("items.product");

  res.status(201).json({ status: "success", message: "Item added to cart", data: cart });
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { quantity } = req.body;
  const cart = await getOrCreateCart();

  const item = cart.items.find((item) => item.product.toString() === req.params.productId);
  if (!item) {
    return next(new AppError("Item not in cart", 404));
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  recalculateTotal(cart);
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({ status: "success", message: "Cart item updated", data: cart });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await getOrCreateCart();

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

  recalculateTotal(cart);
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({ status: "success", message: "Item removed from cart", data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({ status: "success", message: "Cart cleared", data: cart });
});