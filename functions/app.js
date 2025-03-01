const express = require('express');
const serverless = require('serverless-http');
const app = express();
const path = require("path");

app.use(express.json());

let routerApps = require('../app/routers/router.js');
app.use("/.netlify/functions/app", routerApps);
module.exports.handler = serverless(app);