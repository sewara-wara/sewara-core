require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const routerApps = require('../app/routers/router.js');
const errorMiddleware = require('../app/middlewares/error.js');

app.use('/.netlify/functions/api', routerApps);

app.use((req, res, next) => {
    res.status(404).json({ code: 404, message: 'Route tidak ditemukan' });
});

app.use(errorMiddleware);

module.exports.handler = serverless(app);