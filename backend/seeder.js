const mongoose = require("mongoose");
require("dotenv").config();
const users = require("./data/users.js");
const products = require("./data/products.js");
const User = require("./models/userModel.js");
const Product = require("./models/productModel.js");
const Order = require("./models/orderModel.js");
const connectDB = require("./config/db.js");

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0].id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    console.log("Data Imported!");
    process.exit();
  } catch (err) {
    console.log(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Prodct.deleteMany();
    await User.deleteMany();

    console.log("data Destroyed!");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
