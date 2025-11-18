const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Single", "Dating", "Married"],
  },
  partner: {
    type: String,
  },
});

const Person = mongoose.model("Person", personSchema);

mongoose.connect(process.env.DB_URL);

async function getPerson(email) {
  const result = await Person.find();
  return result;
}

app.get("/:id", async (req, res, next) => {
  console.log(req.params.id);
  const r = await getPerson("nthnlwlcx23@dordt.edu");
  res.send(r);
});

app.post("/user", async (req, res, next) => {
  console.log(req.body);
  const r = await getPerson("nthnlwlcx23@dordt.edu");
  res.send(r);
});

app.post("/get", async (req, res, next) => {
  let { email, id } = req.body;
});

app.post("/create", async (req, res, next) => {
  let { name, email, status, id } = req.body;
  const person = new Person({
    name,
    email,
    status,
  });
  await person.save();
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Running");
});
