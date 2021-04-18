const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const patientSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: String,
  condition: String,
}, {collection: 'patients'});

const completeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  condition: String,
  treatment: String,
  doctor: String,
}, {collection: 'completed'});

const Patient = mongoose.model('Patient', patientSchema);
const Complete = mongoose.model('Complete', completeSchema);

mongoose.connect('mongodb://localhost:27017/assistant', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.post('/api/patient', async (req, res) => {
  const patient = new Patient({
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    condition: req.body.condition
  });
  try {
    await patient.save();
    res.send(patient);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    let patients = await Patient.find();
    res.send(patients);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    await Patient.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    let patient = await Patient.findOne({_id: req.params.id});
    patient.name = req.body.name;
    patient.gender = req.body.gender;
    patient.age = req.body.age;
    patient.condition = req.body.condition;
    patient.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/completed', validUser, async (req, res) => {
  const complete = new Complete({
    user: req.body.user,
    _id: req.body._id,
    name: req.body.name,
    condition: req.body.condition,
    treatment: req.body.treatment,
    doctor: req.body.doctor,
  });
  try {
    await complete.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/completed', async (req, res) => {
  try {
    let patients = await Complete.find();
    res.send(patients);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/completed/:id', async (req, res) => {
  try {
    await Complete.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.use("/api/users", users.routes);

app.listen(3009, () => console.log('Server listening on port 3009!'));
