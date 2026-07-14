import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";

export const getAllProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.inStock === "true") {
    filter.inStock = true;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter);
  res.status(200).json({ status: "success", message: "Products fetched", data: products });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const product = await Product.findById(req.params.id).populate("category", "name description");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ status: "success", message: "Product fetched", data: product });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 404));
  }

  const newProduct = await Product.create(req.body);
  res.status(201).json({ status: "success", message: "Product created", data: newProduct });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError("Category not found", 404));
    }
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("category", "name description");

  if (!updated) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ status: "success", message: "Product updated", data: updated });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const deleted = await Product.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ status: "success", message: "Product deleted", data: null });
});