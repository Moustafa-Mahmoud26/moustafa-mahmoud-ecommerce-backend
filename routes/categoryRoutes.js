import { Router } from "express";
import { param, body } from "express-validator";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategories);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid category ID")],
  getCategoryById,
);

router.post(
  "/",
  [body("name").notEmpty().withMessage("Category name is required")],
  createCategory,
);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid category ID"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Category name cannot be empty"),
  ],
  updateCategory,
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid category ID")],
  deleteCategory,
);

export default router;