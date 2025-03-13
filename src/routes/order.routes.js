const express = require("express");
const router = express.Router();
const orderController = require("../controllers/oder.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

router.post("/orders", authMiddleware, orderController.createOrder);

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,  
  orderController.getAllOrders
);

router.get("/my-order", authMiddleware, orderController.getUserOrders);

router.get("/orders/:id", authMiddleware, orderController.getOrderById);

router.delete("/orders/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
