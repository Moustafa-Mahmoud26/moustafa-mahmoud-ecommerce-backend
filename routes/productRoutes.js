import { Router } from "express";
import { param, body } from "express-validator";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/:id", [param("id").isMongoId().withMessage("Invalid product ID")], getProductById);

router.post("/", [
  body("name").notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").isMongoId().withMessage("Category must be a valid ID"),
], createProduct);

router.patch("/:id", [
  param("id").isMongoId().withMessage("Invalid product ID"),
  body("category").optional().isMongoId().withMessage("Category must be a valid ID"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
], updateProduct);

router.delete("/:id", [param("id").isMongoId().withMessage("Invalid product ID")], deleteProduct);

export default router;