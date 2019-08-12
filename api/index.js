const router = require('express').Router();

router
	.use('/users', require('./users'))
	.use('/logins', require('./logins'))
	.use(handleValidationError)	;

// Send mongoose validation errors, reformatted as key-values,
// with status: 422, Unprocessable Entity
function handleValidationError(err, req, res, next) {
	if (err.name === 'ValidationError') {
		return res.status(422).json({
			errors: Object.keys(err.errors).reduce((errors, key) => {
				errors[key] = err.errors[key].message;
				return errors;
			}, {})
		});
	}
	next(err);
}

module.exports = router;