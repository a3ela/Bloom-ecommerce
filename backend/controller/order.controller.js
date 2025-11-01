const asyncHandler = require("../middleware/asyncHandler.js");
const Order = require("../models/order.model.js");

const addOrder = asyncHandler(async (request, response) => {

 const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items found");
  }

  const order = new Order({
    user: req.user.id,
    orderItems: orderItems.map(item => ({
      ...item,
      product: item.id,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id).populate('user', 'name email');

    if (order) {
        response.json(order);
    } else {
        response.status(404);
        throw new Error("Order not found");
    }
});

const getUserOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user.id });
    response.status(200).json(orders);
});

const updateOrderToPaid = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        response.json(updatedOrder);
    } else {
        response.status(404);
        throw new Error("Order not found");
    }
});

const updateOrderToDelivered = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        response.json(updatedOrder);
    } else {
        response.status(404);
        throw new Error("Order not found");
    }
});

const getOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({});
    response.json(orders);
});

module.exports = {
  addOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};