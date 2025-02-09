const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./users/index"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || " Internal server error.");
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

module.exports = app;
