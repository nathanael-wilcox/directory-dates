const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios").default;
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

async function getById(id) {
  const result = await Person.find({ _id: id });
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

app.get("/", (req, res, next) => {
  res.send("Success");
});

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
  const person = await getById(id);
  if (req.body.partner) {
    partner = req.body.partner;
  }
  if (req.body.status) {
    status = req.body.status;
  }
  if (person[0]) {
    if (status == "Married" && person[0].partner) {
      partner = person[0].partner;
    }
    let r = await updateStatus(id, status, partner);
    res.send(r);
  }
});

app.get("/", (req, res, next) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log("Server started");
});

setInterval(() => {
  axios.get("http://bit.ly/2mTM3nY", { responseType: "json" }).then((res) => {
    console.log(res.status + " - " + res.statusText);
  });
}, 1000 * 60 * 14);
