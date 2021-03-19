const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('../routes/user');
const auth = require('../routes/auth')
const express = require('express');

const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();

// dotenv Initialization
require('dotenv').config();

// BodyParser set up
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//routes
app.use(express.json());
app.use('/', require('../routes/routes'));

// CORS Enabling Middleware
app.use(
  cors({
    credentials: true,
    origin: true
  })
);




// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status).send({
    error: err.message
  });
});

module.exports = app;