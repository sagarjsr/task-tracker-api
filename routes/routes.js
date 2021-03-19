const express = require('express');
const Router = express.Router();

Router.use('/api/signup', require('./user'));
Router.use('/api/login', require('./auth'));
Router.use('/api/v1', require('./track'));


module.exports = Router;