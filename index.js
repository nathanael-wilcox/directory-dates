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

async function getPeople(names) {
  const result = await Person.find({ name: { $in: names } });
  return result;
}

async function getByEmail(email) {
  const result = await Person.find({ email: email });
  console.log(result);
  return result;
}

app.post("/user", async (req, res, next) => {
  let { email } = req.body;
  const r = await getByEmail(email);
  res.send(r);
});

app.post("/get", async (req, res, next) => {
  let { names } = req.body;
  const r = await getPeople(names);
  res.send(r);
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
