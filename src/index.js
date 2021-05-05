require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')

const mongodb = require('./DB/mongodb.js');
const {login, signup} = require('../src/controller/index')

const port = 5000;

const app = express();


app.use(express.json())

mongodb.connect()


app.get('/', (req, res) => {
  res.status(200).send('Hello World')
})

app.post('/signup', signup, (req, res) => {
  res.status(201).send('user created')
})

app.post('/login', login, (req, res) => {
  res.status(200).send('user logged in')
})

app.listen(port, () => {
  console.log(`Server started on ${port}`)
})
