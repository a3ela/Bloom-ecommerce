const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler.js");
const Product = require("../models/productModel.js");

router.get("/", asyncHandler(async (request, response) => {
  const products = await Product.find({});
  response.json(products);
}));

router.get("/:id", asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);

    if (product) {
      response.json(product);
    }

    response.status(404).json({message: "Product not found"})
}));

module.exports = router;