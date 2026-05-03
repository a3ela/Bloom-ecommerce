const asyncHandler = require("../middleware/asyncHandler.js");
const mongoose = require("mongoose");
const Product = require("../models/product.model.js");
const seedProducts = require("../data/products.js");

const seededProducts = seedProducts.map((product) => {
  const id = new mongoose.Types.ObjectId().toString();
  return { ...product, _id: id, id };
});

const shouldUseSeedFallback = () =>
  process.env.USE_SEED_FALLBACK === "true" &&
  mongoose.connection.readyState !== 1;

const getProducts = asyncHandler(async (request, response) => {
  if (shouldUseSeedFallback()) {
    return response.json(seededProducts);
  }

  const products = await Product.find({});
  response.json(products);
});

const getProductById = asyncHandler(async (request, response) => {
  if (shouldUseSeedFallback()) {
    const product = seededProducts.find(
      (item) => item.id === request.params.id,
    );

    if (product) {
      return response.json(product);
    }

    response.status(404);
    throw new Error("Product not found");
  }

  const product = await Product.findById(request.params.id);

  if (product) {
    response.json(product);
  } else {
    response.status(404);
    throw new Error("Product not found");
  }
});

module.exports = { getProducts, getProductById };
