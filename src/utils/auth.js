const User = require('../routes/users/users.model');
const wrap = require('./wrap');
const logger = require('../config/winston');

const load = wrap(async (req, res, next) => {
	if (req.auth) {
		const { username } = req.auth;
		if (!username) {
			logger.error('the username is not present in the authentication token');

			return res.status(401).json({
				message: 'invalid authentication',
				errors: {
					username: 'is missing',
				},
			});
		}

		logger.info('searching the authenticated user in the database');
		const user = await User.findOne({ username });

		if (!user) {
			logger.error('the authenticated username was not found in the database');

			return res.status(401).json({
				message: 'invalid authentication',
				errors: {
					username: 'is unknown',
				},
			});
		}

		logger.info('saving the authenticated user in the request');
		req.auth = user; // expands req.auth to its full User
	}
	next();
});

module.exports = { load };
