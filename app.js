const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./users/index"));
app.use("/api/items", require("./items/index"));
app.use("/api/items", require("./items/index"));
app.use("/api/items", require("./reviews/index"));
app.use("/api/items", require("./comments/index"));
app.use("/api/reviews", require("./reviews/index"));
app.use("/api/comments", require("./comments/index"));
app.use("/api/users", require("./reviews/index"));
app.use("/api/users", require("./comments/index"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || " Internal server error.");
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

module.exports = app;
