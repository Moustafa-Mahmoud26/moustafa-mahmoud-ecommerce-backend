import { Router } from "express";
import { param, body } from "express-validator";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", getCart);

router.post("/items", [
  body("productId").isMongoId().withMessage("productId must be a valid ID"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive number"),
], addItemToCart);

router.patch("/items/:productId", [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be 0 or greater"),
], updateCartItem);

router.delete("/items/:productId", [param("productId").isMongoId().withMessage("Invalid product ID")], removeCartItem);

router.delete("/", clearCart);

export default router;