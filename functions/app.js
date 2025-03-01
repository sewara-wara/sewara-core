const express = require('express');
const serverless = require('serverless-http');
const errorHandler = require('../app/middleware/error.js');
const app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let routerApps = require('../app/routers/router.js');
app.use("/.netlify/functions/app", routerApps);

app.use(errorHandler);
module.exports.handler = serverless(app);