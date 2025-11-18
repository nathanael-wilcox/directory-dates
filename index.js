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
  return result;
}

async function updateStatus(id, status, partner) {
  let params = { partner };
  if (status != "") {
    params.status = status;
  }
  const result = await Person.findOneAndUpdate({ _id: id }, params, { new: true });
  return result;
}

app.post("/user", async (req, res, next) => {
  let { email, name } = req.body;
  let r = await getByEmail(email);
  if (r[0]) {
    res.send(r);
  } else {
    const person = new Person({
      name,
      email,
    });
    await person.save();
    res.send([person]);
  }
});

app.post("/get", async (req, res, next) => {
  let { names } = req.body;
  const r = await getPeople(names);
  res.send(r);
});

app.post("/update", async (req, res, next) => {
  let { id } = req.body;
  let status = "";
  let partner = "None";
  if (req.body.partner) {
    partner = req.body.partner;
  }
  if (req.body.status) {
    status = req.body.status;
  }
  let r = await updateStatus(id, status, partner);
  res.send(r);
});

app.listen(port, () => {
  console.log("Running");
});
