const express = require("express");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');

// routes
const productsRoutes = require('./routes/productsRoutes.js')

// connect with DB
connectDB();
const app = express();

app.get("/", (request, response) => {
  response.send("api is running");
});

app.use('/api/products', productsRoutes);

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
