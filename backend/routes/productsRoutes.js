const router = require("express").Router();
const products = require("../data/products.js");

router.get("/", (request, response) => {
  response.json(products);
});

router.get("/:id", (request, response) => {
    const product = products.find(p => p.id === request.params.id);
    response.json(product);
});

module.exports = router;