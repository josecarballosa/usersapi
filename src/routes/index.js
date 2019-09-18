const router = require('express').Router();

const logger = require('../utils/logger');
const logins = require('./logins');
const users = require('./users');

logger.info('loading child router: /logins');
// router.use('/logins', require('./logins'));
router.use('/logins', logins);

logger.info('loading child router: /users');
// router.use('/users', require('./users'));
router.use('/users', users);

logger.info('loading a handler for unknown routes');
router.use(unknownRoute);

logger.info('loading a handler for validation errors');
router.use(handleValidationErrors);

logger.info('loading a handler for authentication errors');
router.use(handleAuthenticationErrors);

function unknownRoute(req, res, next) {
	logger.error('handling unknown route request: %O', {
		method: req.method,
		url: req.url,
	});

	res.status(404).json({
		message: 'invalid route',
	});
}

// Reformat mongoose validation errors as key-value pairs
function handleValidationErrors(err, req, res, next) {
	if (err.name === 'ValidationError') {
		logger.error('handling validation errors: %O', err);

		return res.status(400).json({
			message: 'invalid user data',
			errors: Object.keys(err.errors).reduce((errors, key) => {
				errors[key] = err.errors[key].message;
				return errors;
			}, {}),
		});
	}
	next(err);
}

// Wrap "express-jwt" error messages
function handleAuthenticationErrors(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		logger.error('handling authentication error: %O', err);

		return res.status(401).json({
			message: 'invalid authentication',
			errors: { token: err.message },
		});
	}
	next(err);
}

module.exports = router;
