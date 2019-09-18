const User = require('./users.model');
const { wrap, jwt } = require('../../middleware');
const logger = require('../../utils/logger');

// TODO: Try throwing errors instead of calling res.status().json()

const findUser = wrap(async (req, res, next, username) => {
	logger.info('finding the user indicated in the route param');

	logger.info('searching the database');
	const user = await User.findOne({ username });
	if (!user) {
		logger.error('username not found: %O', username);

		return res.status(404).json({
			message: 'invalid user',
			errors: { username: 'is unknown' },
		});
	}

	logger.info('saving the found user in the request object');
	req.user = user;
	next();
});

const createUser = wrap(async (req, res, next) => {
	logger.info('creating a new user');

	if (!req.body.user) {
		logger.error('user object missing from request body');

		return res.status(400).json({
			message: 'invalid user data',
			errors: { user: 'is missing' },
		});
	}
	const { password, ...userData } = req.body.user;
	if (!password) {
		logger.error('user password missing from request body');

		return res.status(400).json({
			message: 'invalid user data',
			errors: { password: 'is missing' },
		});
	}
	let user = new User(userData);
	user.setPassword(password);

	logger.info('saving the new user to the database');
	user = await user.save();

	logger.info('generating an access token');
	const token = jwt.getToken(user.username);

	res.json({ token, user: user.toJSON(true) });
});

const getAllUsers = wrap(async (req, res, next) => {
	logger.info('getting all users');

	logger.info('searching all users in the database');
	const users = await User.find();

	res.json({ users: users.map(user => user.toJSON(false)) });
});

const getOneUser = wrap(async (req, res, next) => {
	logger.info('getting one user');

	// req.auth is loaded by jwt middleware (if given)
	// req.user is loaded by param middleware

	logger.info('checking the request authentication context: %O', req.auth);
	const includePrivateData = req.auth && req.user.equals(req.auth);
	logger.info(
		`the request is ${
			includePrivateData ? '' : 'not'
		} authorized to see user private data`,
	);

	const user = req.user.toJSON(includePrivateData);
	return res.json({ user });
});

const updateUser = wrap(async (req, res, next) => {
	logger.info('updating a user');

	// req.user is loaded by param middleware
	let user = req.user;

	// req.auth is loaded by jwt middleware (verified)
	logger.info('checking the request authentication context: %O', req.auth);
	if (!user.equals(req.auth)) {
		logger.error('attempted to update another user');

		return res.status(403).json({
			message: 'invalid authorization',
			errors: { user: 'is wrong' },
		});
	}

	if (!req.body.user) {
		logger.error('request body is missing the update data');

		return res.status(400).json({
			message: 'invalid user data',
			errors: { user: 'is missing' },
		});
	}

	const { username, email, bio, image, password } = req.body.user;

	// update only the fields actually passed for update...
	if (typeof username !== 'undefined') {
		user.username = username;
	}
	if (typeof email !== 'undefined') {
		user.email = email;
	}
	if (typeof bio !== 'undefined') {
		user.bio = bio;
	}
	if (typeof image !== 'undefined') {
		user.image = image;
	}
	if (typeof password !== 'undefined') {
		await user.setPassword(password);
	}

	logger.info('saving the updated user to the database');
	user = await user.save();

	res.json({ user: user.toJSON(true) });
});

const deleteUser = wrap(async (req, res, next) => {
	logger.info('deleting a user');

	let user = req.user;

	// req.auth is guaranteed by router configuration
	logger.info('checking the request authentication context: %O', req.auth);
	if (!user.equals(req.auth)) {
		logger.error('attempted to delete another user');

		return res.status(403).json({
			message: 'invalid authorization',
			errors: { user: 'is wrong' },
		});
	}

	logger.info('deleting the user from the database');
	user = await user.remove();

	res.json({ user: user.toJSON(true) });
});

module.exports = {
	findUser,
	createUser,
	getAllUsers,
	getOneUser,
	updateUser,
	deleteUser,
};
