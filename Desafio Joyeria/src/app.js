require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const joyasRoutes = require('./routes/joyas');
const logger = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(logger);

app.use('/joyas', joyasRoutes);

module.exports = app;