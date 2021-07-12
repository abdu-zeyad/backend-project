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
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const reviews = new mongoose.Schema({
  namereview: String,
  review: String,
});
const itemSchema = new mongoose.Schema({
  name: String,
  age: String,
  reviews: [reviews],
});

const Item = mongoose.model("Items", itemSchema);

//  ////// ///      //  routs

app.post("/post", postHandler);
app.get("/all", getAll);
app.delete("/delete", deleteitem);
app.put("/update", updatehandler);
app.get("/itempage", itempage);
app.post("/postreview", postrevies);
app.delete("/deletereview", deletereview);
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

function updatehandler(req, res) {
  console.log(req.body);
  const { name, age, id } = req.body;

  Item.find({ _id: id }, (err, data) => {
    data[0].name = name;
    data[0].age = age;
    data[0].save().then(() => {
      Item.find({}, (err, data) => {
        res.send(data);
      });
    });
  });
}
function itempage(req, res) {
  const id = req.query.id;

  Item.find({ _id: id }, (err, data) => {
    res.send(data);
  });
}

function postrevies(req, res) {
  const { namereview, review, id } = req.body;
  console.log(req.body);
  Item.find({ _id: id }, (err, data) => {
    data[0].reviews.push({
      namereview: namereview,
      review: review,
    });

    console.log(data[0]);
    data[0].save();
    res.send(data[0].reviews);
  });
}

function deletereview(req, res) {
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
