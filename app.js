const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const { env, mongoUrl } = require('./config');
const router = require('./api');

// TODO: Is a good practice to keep the DB connection open?
(async () => {
	try {
		await mongoose.connect(mongoUrl, {
			useNewUrlParser: true,
			useCreateIndex: (env !== 'production'),
		});
	} catch (error) {
		console.log('Error: Failed to connect to the database');
		process.exit(1);
	}
})();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env === 'development') {
	app.use(logger('dev'));
}

app.use('/api', router);

// Handle unknown routes
app.use((req, res, next) => {
	res.status(404).json({ errors: {"route": "is invalid"} });
});

// Handle body-parser errors
app.use((err, req, res, next) => {
	if (err.type === 'entity.parse.failed') {
		return res.status(400).json({ errors: {"body": "cannot be parsed"} });
	}
	next(err);
});

// Handle "express-jwt" errors
app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ errors: {"auth token": "is invalid"} });
	}
	next(err);
});

// Handle unexpected errors
app.use((err, req, res, next) => {
	res.status(500).json({ errors: {"something": "went wrong"} });
});

module.exports = app;