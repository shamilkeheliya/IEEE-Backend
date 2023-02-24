const express = require('express');
const routes = express.Router();

const admin = require('./routes/admin');
const drug = require('./routes/drug');
const pharmacy = require('./routes/pharmacy');

routes.use('/admin', admin);
routes.use('/drug', drug);
routes.use('/pharmacy', pharmacy);

module.exports = routes;