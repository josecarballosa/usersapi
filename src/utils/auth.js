const User = require('../routes/users/users.model');
const wrap = require('./wrap');

const load = wrap(async (req, res, next) => {
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
});

module.exports = { load };
