const router = require('express').Router();

router
	.use('/users', require('./users'))
	.use('/logins', require('./logins'))
	.use(handleValidationError)	;

// Reformat mongoose validation errors as key-value pairs
function handleValidationError(err, req, res, next) {
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			errors: Object.keys(err.errors).reduce((errors, key) => {
				errors[key] = err.errors[key].message;
				return errors;
			}, {})
		});
	}
	next(err);
}

module.exports = router;