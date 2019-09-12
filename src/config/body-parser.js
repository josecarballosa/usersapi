const express = require('express');
const logger = require('../config/winston');

function config(app) {
	logger.info('loading middleware to parse json request bodies');
	app.use(express.json());

	logger.info('loading middleware to parse url-encoded request bodies');
	app.use(express.urlencoded({ extended: true }));

	logger.info('loading a handler for body parser errors');
	app.use(handleBodyParserErrors);
}

function handleBodyParserErrors(err, req, res, next) {
	if (err.type === 'entity.parse.failed') {
		logger.error('handling body parser error: %O', err);

		return res.status(400).json({
			message: 'invalid data',
			errors: { body: 'is malformed' },
		});
	}
	next(err);
}

module.exports = config;
