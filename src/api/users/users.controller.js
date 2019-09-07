const User = require('./users.model');
const { asyncHandler, jwt } = require('../utils');

// TODO: Try throwing errors instead of calling res.status().json()

const findUser = asyncHandler(async (req, res, next, username) => {
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(404).json({
			message: 'invalid user',
			errors: { username: 'is unknown' },
		});
	}
	req.user = user;
	next();
});

const createUser = asyncHandler(async (req, res, next) => {
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

const getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	res.json({ users: users.map(user => user.toJSON(false)) });
});

const getOneUser = asyncHandler(async (req, res, next) => {
	// req.auth is loaded by jwt middleware (if given)
	// req.user is loaded by param middleware
	const includePrivateData = req.auth && req.user.equals(req.auth);
	return res.json({ user: req.user.toJSON(includePrivateData) });
});

const updateUser = asyncHandler(async (req, res, next) => {
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

const deleteUser = asyncHandler(async (req, res, next) => {
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
