const express = require('express');
const serverless = require('serverless-http');
const app = express();
const path = require("path");

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let routerApps = require('../app/routers/router.js');
app.use("/.netlify/functions/app", routerApps);
module.exports.handler = serverless(app);