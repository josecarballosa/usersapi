const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { env, mongoDbUri } = require('./config');
const router = require('./router');

mongoose.connect(mongoDbUri, {
	useNewUrlParser: true,
	useCreateIndex: (env !== 'production'),
});

const api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

if (env !== 'production') {
	api.use(logger('dev'));
}

api.use('/api/v1', router);

// Handle unknown routes
api.use((req, res, next) => {
	res.status(404).json({ errors: {"route": "is invalid"} });
});

// Handle body-parser errors
api.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ errors: {"body": "cannot be parsed"} });
	 }
  next();
});

// Handle "express-jwt" errors
api.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ errors: {"token": "is invalid"} });
	 }
  next();
});

// Handle unexpected errors
api.use((err, req, res, next) => {
	res.status(500).json({ errors: {"something": "went wrong"} });
});

module.exports = api;