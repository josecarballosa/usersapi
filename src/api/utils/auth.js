const User = require('../users/users.model');
const asyncHandler = require('./async-handler');

// TODO: aggregate express-jwt middleware

// TODO: use OpenID connect and Auth2

module.exports = {
	load: asyncHandler(async (req, res, next) => {
		if (req.auth) {
			const { username } = req.auth;
			if (!username) {
				return res.status(401).json({
					message: 'invalid authentication',
					errors: {
						username: 'is missing',
					},
				});
			}
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(401).json({
					message: 'invalid authentication',
					errors: {
						username: 'is unknown',
					},
				});
			}
			req.auth = user; // expands req.auth to its full User
		}
		next();
	}),
};
