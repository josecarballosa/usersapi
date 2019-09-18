const User = require('../users/users.model');
const { wrap, jwt } = require('../../utils');
const logger = require('../../bootstrap/winston');

const createLogin = wrap(async (req, res, next) => {
	logger.info('logging in');

	if (!req.body.user) {
		logger.error('the user is missing from the body');

		return res.status(400).json({
			message: 'invalid user data',
			errors: {
				user: 'is missing',
			},
		});
	}
	const { username, password } = req.body.user;

	if (!username) {
		logger.error('the username is missing');

		return res.status(400).json({
			message: 'invalid user data',
			errors: {
				username: 'is missing',
			},
		});
	}
	if (!password) {
		logger.error('the password is missing');

		return res.status(400).json({
			message: 'invalid user data',
			errors: {
				password: 'is missing',
			},
		});
	}

	logger.info('searching the user by username in the database');
	let user = await User.findOne({ username });

	if (!user) {
		logger.error('the username do not exist');

		return res.status(401).json({
			message: 'invalid authentication',
			errors: { 'username or password': 'is invalid' },
		});
	}

	if (!user.checkPassword(password)) {
		logger.error("the password doesn't match");

		return res.status(401).json({
			message: 'invalid authentication',
			errors: { 'username or password': 'is invalid' },
		});
	}

	logger.info('generating an access token');
	const token = jwt.getToken(username);

	res.json({ token, user: user.toJSON(true) });
});

module.exports = { createLogin };
