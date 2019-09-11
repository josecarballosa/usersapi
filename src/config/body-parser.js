const express = require('express');
const debug = require('../utils/debug');

function config(app) {
	debug.info('loading json body parser middleware');
	app.use(express.json());

	debug.info('loading url-encoded body parser middleware');
	app.use(express.urlencoded({ extended: true }));

	debug.info('setting body parser error handler');
	app.use(handleBodyParserErrors);
}

function handleBodyParserErrors(err, req, res, next) {
	if (err.type === 'entity.parse.failed') {
		debug.error('body parser error handler was called');

		debug.error('returning error response');
		return res.status(400).json({
			message: 'invalid data',
			errors: { body: 'is malformed' },
		});
	}
	next(err);
}

module.exports = config;
