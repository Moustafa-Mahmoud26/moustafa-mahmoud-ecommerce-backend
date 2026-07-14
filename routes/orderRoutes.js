import { Router } from "express";
import { param, body } from "express-validator";
import {
  checkout,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.post("/", [
  body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
], checkout);

router.get("/", getAllOrders);

router.get("/:id", [param("id").isMongoId().withMessage("Invalid order ID")], getOrderById);

router.patch("/:id/status", [
  param("id").isMongoId().withMessage("Invalid order ID"),
  body("status").notEmpty().withMessage("Status is required"),
], updateOrderStatus);

export default router;