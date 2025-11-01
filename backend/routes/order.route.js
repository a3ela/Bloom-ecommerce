  const router = require("express").Router();
  const {
  addOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} = require("../controller/order.controller.js");
  const { protect, admin } = require("../middleware/auth.middleware.js");

  router.route("/").post(protect, addOrder).get(protect, admin, getOrders);
  router.route("/myorders").get(protect, getUserOrders);
  router.route("/:id").get(protect, admin, getOrderById);
  router.route("/:id/pay").put(protect, updateOrderToPaid);
  router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

  module.exports = router;