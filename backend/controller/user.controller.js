const asyncHandler = require("../middleware/asyncHandler.js");
const Product = require("../models/product.model.js");

const getUser = asyncHandler(async (request, response) => {
  const products = await Product.find({});
  response.json(products);
});