const express = require("express");
const PORT = 5000;

const app = express();

app.get("/", (request, response) => {
  response.send("api is running");
});

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
