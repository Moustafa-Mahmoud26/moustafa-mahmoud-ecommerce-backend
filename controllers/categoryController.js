import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ status: "success", message: "Categories fetched", data: categories });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ status: "success", message: "Category fetched", data: category });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const newCategory = await Category.create(req.body);
  res.status(201).json({ status: "success", message: "Category created", data: newCategory });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ status: "success", message: "Category updated", data: updated });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const deleted = await Category.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ status: "success", message: "Category deleted", data: null });
});