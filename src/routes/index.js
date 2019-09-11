const router = require('express').Router();
const debug = require('../utils/debug');

debug.info('loading router: /logins');
router.use('/logins', require('./logins'));

debug.info('loading router: /users');
router.use('/users', require('./users'));

debug.info('loading unknown route handler');
router.use(unknownRoute);

debug.info('loading validation errors handler');
router.use(handleValidationErrors);

debug.info('loading authentication errors handler');
router.use(handleAuthenticationErrors);

function unknownRoute(req, res, next) {
	debug.error('the unknown route handler was called');
	debug.error('req: %O', {
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
		debug.error('the validation errors handler was called');
		debug.error('err: %O', err);

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
		debug.error('the authorization errors handler was called');
		debug.error('err: %O', err);

		return res.status(401).json({
			message: 'invalid authentication',
			errors: { token: err.message },
		});
	}
	next(err);
}

module.exports = router;
