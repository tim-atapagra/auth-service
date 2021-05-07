require("dotenv").config();

const express = require("express");

const mongodb = require("./DB/mongodb.js");
const { login, signup, validate } = require("../src/controller/index");

const port = 5000;

const app = express();

app.use(express.json());

mongodb.connect();

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/signup", signup);

app.post("/login", login);

app.post("/validate", validate);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

module.exports = app;
