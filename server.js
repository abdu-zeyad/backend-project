"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
const PORT = process.env.PORT;
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/item", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: String,
  age: String,
});

const Item = mongoose.model("Items", itemSchema);

//  ////// ///      //  routs

app.post("/post", postHandler);
app.get("/all", getAll);
app.delete("/delete", deleteitem);
/// ///// handlers////////////

function postHandler(req, res) {
  const { name, age } = req.body;
  const test = new Item({ name: name, age: age });

  Item.find({}, (err, data) => {
    res.send(data);
  });
  console.log(test);
  test.save();
}
function getAll(req, res) {
  Item.find({}, (err, data) => {
    res.send(data);
  });
}
function deleteitem(req, res) {
  const id = req.query.id;
  Item.deleteOne({ _id: id }, (err, data) => {
    Item.find({}, (err, data) => {
      res.send(data);
    });
  });
}
//  /  ///

app.post("/", (req, res) => {
  res.send("home");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});