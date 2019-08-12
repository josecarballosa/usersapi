const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { env, mongoDbUri } = require('./config');
const router = require('./api');

mongoose.connect(mongoDbUri, {
	useNewUrlParser: true,
	useCreateIndex: (env !== 'production'),
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (env !== 'production') {
	app.use(logger('dev'));
}

app.use('/api/v1', router);

// Handle unknown routes
app.use((req, res, next) => {
	res.status(404).json({ errors: {"Route": "is invalid"} });
});

// Handle body-parser errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ errors: {"Body": "cannot be parsed as JSON"} });
	 }
  next();
});

// Handle "express-jwt" errors
// app.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).json({ errors: {"Token": "is invalid"} });
// 	 }
//   next();
// });

// Handle unexpected errors
app.use((err, req, res, next) => {
	res.status(500).json({ errors: {"Something": "went wrong"} });
});

module.exports = app;