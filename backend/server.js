const express = require("express");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// routes
const productsRoutes = require('./routes/products.routes.js')
const authRoutes = require('./routes/auth.routes.js')

// connect with DB
connectDB();

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.send("api is running");
});

app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
