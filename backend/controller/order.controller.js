const asyncHandler = require("../middleware/asyncHandler.js");
const Order = require("../models/order.model.js");

const addOrder = asyncHandler(async (request, response) => {

 const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, totalPrice } = request.body;

  if (!orderItems || orderItems.length === 0) {
    response.status(400);
    throw new Error("No order items found");
  }

  const order = new Order({
    user: request.user.id,
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
  response.status(201).json(createdOrder);
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
    console.log("✅ Payment update received:", request.body);

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: request.body.id,
      status: request.body.status,
      update_time: request.body.update_time,
      email_address: request.body?.payer?.email_address || "test@example.com",
    };

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