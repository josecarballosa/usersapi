const User = require('../users/users.model');
const { asyncHandler, jwt } = require('../utils');

module.exports = {
	createLogin: asyncHandler(async (req, res, next) => {
		if (!req.body.user) {
			return res.status(400).json({
				message: 'invalid user data',
				errors: {
					user: 'is missing',
				},
			});
		}
		const { username, password } = req.body.user;
		if (!username) {
			return res.status(400).json({
				message: 'invalid user data',
				errors: {
					username: 'is missing',
				},
			});
		}
		if (!password) {
			return res.status(400).json({
				message: 'invalid user data',
				errors: {
					password: 'is missing',
				},
			});
		}
		let user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({
				message: 'invalid authentication',
				errors: { 'username or password': 'is invalid' },
			});
		}
		if (!user.checkPassword(password)) {
			return res.status(401).json({
				message: 'invalid authentication',
				errors: { 'username or password': 'is invalid' },
			});
		}
		const token = jwt.getToken(username);
		res.json({ token, user: user.toJSON(true) });
	}),
};
