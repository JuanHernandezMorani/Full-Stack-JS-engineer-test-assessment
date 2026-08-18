const { Router } = require('express');
const countries = require('./countries.js');

const api = Router();

api.use('/countries', countries);


module.exports = api;