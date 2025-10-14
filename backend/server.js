const express = require("express");
const products = require("./products.js");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');

// connect with DB
connectDB();
const app = express();

app.get("/", (request, response) => {
  response.send("api is running");
});

app.get("/api/products", (request, response) => {
  response.json(products);
});

app.get("/api/products/:id", (request, response) => {
    const product = products.find(p => p.id === request.params.id);
    response.json(product);
});

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
