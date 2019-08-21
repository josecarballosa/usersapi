const User = require('./users.model');
const { asyncHandler, jwt } = require('../utils');

module.exports = {

	// TODO: Try throwing errors instead of calling res.status().json()

	findUser: asyncHandler( async (req, res, next, username) =>	{
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ errors: {"username": "is unknown"} });
		}
		req.user = user;
		next(); // TODO: Check if I need to call next() here
	}),

	createUser: asyncHandler( async (req, res, next) => {
		const {password, ...userData} = req.body.user;
		if (!password) {
			return res.status(400).json({ errors: {"password": "is missing"} });
		}
		let user = new User(userData);
		user.setPassword(password);
		user = await user.save();
		const token = jwt.getToken(user.username);
		res.json({ token, user: user.toJSON(true) });
	}),

	getAllUsers: asyncHandler( async (req, res, next) => {
		const users = await User.find();
		res.json({ users: users.map(user => user.toJSON(false)) });
	}),

	getOneUser: asyncHandler( async (req, res, next) => {
		const includePrivateData = req.auth && req.user.equals(req.auth);
		res.json({ user: req.user.toJSON(includePrivateData) });
	}),

	updateUser: asyncHandler( async (req, res, next) => {
		let user = req.user;

		// req.auth is guaranteed by router configuration
		if (!user.equals(req.auth)) {
			return res.status(403).json({ errors: {"user": "is wrong"} });
		}

		const { username, email, bio, image, password } =
			req.body.user;

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
	}),

	deleteUser: asyncHandler( async (req, res, next) => {
		let user = req.user;

		// req.auth is guaranteed by router configuration
		if (!user.equals(req.auth))
			return res.status(403).json({ errors: {"user": "is wrong"} });

		user = await user.remove();
		res.json({ user: user.toJSON(true) });
	})
}
