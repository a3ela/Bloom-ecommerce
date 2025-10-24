const router = require("express").Router();
const {getProducts, getProductById} = require("../controller/product.controller.js");

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

module.exports = router;