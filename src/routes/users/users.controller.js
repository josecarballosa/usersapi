const User = require('./users.model');
const { wrap, jwt } = require('../../utils');
const debug = require('../../utils/debug');

// TODO: Try throwing errors instead of calling res.status().json()

const findUser = wrap(async (req, res, next, username) => {
	debug.info('controller.findUser was called');

	const user = await User.findOne({ username });
	if (!user) {
		debug.error('user not found');
		debug.error('username: %O', username);

		return res.status(404).json({
			message: 'invalid user',
			errors: { username: 'is unknown' },
		});
	}

	const userLog = user;
	userLog.hash = '***';
	debug.info('user found: %O', userLog);

	req.user = user;
	next();
});

const createUser = wrap(async (req, res, next) => {
	debug.info('controller.createUser was called');

	if (!req.body.user) {
		return res.status(400).json({
			message: 'invalid user data',
			errors: { user: 'is missing' },
		});
	}
	const { password, ...userData } = req.body.user;
	if (!password) {
		return res.status(400).json({
			message: 'invalid user data',
			errors: { password: 'is missing' },
		});
	}
	let user = new User(userData);
	user.setPassword(password);
	user = await user.save();
	const token = jwt.getToken(user.username);
	res.json({ token, user: user.toJSON(true) });
});

const getAllUsers = wrap(async (req, res, next) => {
	debug.info('controller.getAllUsers was called');

	const users = await User.find();
	res.json({ users: users.map(user => user.toJSON(false)) });
});

const getOneUser = wrap(async (req, res, next) => {
	debug.info('controller.getOneUser was called');
	debug.info('req.auth: %O', req.auth);

	// req.auth is loaded by jwt middleware (if given)
	// req.user is loaded by param middleware
	const includePrivateData = req.auth && req.user.equals(req.auth);
	debug.info('includePrivateData: %O', includePrivateData);
	const user = req.user.toJSON(includePrivateData);
	debug.info('user: %O', user);
	return res.json({ user });
});

const updateUser = wrap(async (req, res, next) => {
	debug.info('controller.updateUser was called');

	// req.user is loaded by param middleware
	let user = req.user;

	// req.auth is loaded by jwt middleware (verified)
	if (!user.equals(req.auth)) {
		return res.status(403).json({
			message: 'invalid authorization',
			errors: { user: 'is wrong' },
		});
	}

	if (!req.body.user) {
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

	user = await user.save();
	res.json({ user: user.toJSON(true) });
});

const deleteUser = wrap(async (req, res, next) => {
	debug.info('controller.deleteUser was called');

	let user = req.user;

	// req.auth is guaranteed by router configuration
	if (!user.equals(req.auth))
		return res.status(403).json({
			message: 'invalid authorization',
			errors: { user: 'is wrong' },
		});

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
