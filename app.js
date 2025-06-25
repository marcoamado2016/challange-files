#!/usr/bin/env node
require('dotenv').config({ path: `${__dirname}/.env` });
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const route = require('./src/interfaces/http/route');
const { connecionDB } = require('./src/infrastructura/db/connection');

morgan.token('host', (req) => req.headers.host);
morgan.token('worker', () => process.pid);

const app = express();

const PORT = process.env.PORT || 3010;

connecionDB().then((data) => {
    console.log("Conexion con la base exitosa")
})
    .catch((error) => {
        console.log("Error ", error)
    })

app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false, parameterLimit: 100000, limit: '100mb' }));
app.use(express.json({ extended: false, parameterLimit: 100000, limit: '100mb' }));
app.use(compression());
app.use(morgan('[:worker] :remote-addr (:user-agent) :host - :method :url HTTP/:http-version :status - :res[content-length] bytes - :response-time[0] ms'));
/* REST CONFIG */

/* ROUTES */
app.use('/', route);
/* ROUTES */

app.listen(PORT, () => console.info(`ReachOut Exercise listening on port ${PORT} and environment ${process.env.NODE_ENV}! - Worker ${process.pid}`));