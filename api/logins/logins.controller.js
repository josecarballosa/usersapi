const User = require('../users/users.model');
const { asyncHandler, jwt } = require('../utils');

module.exports = {

	createLogin: asyncHandler( async (req, res, next) => {
		const { username, password } = req.body.user;
		if(!username) { // TODO: check if 400 is better
			return res.status(422).json({ errors: {"username": "is missing"} });
		}
		if (!password) { // TODO: check if 400 is better
			return res.status(422).json({ errors: {"password": "is missing"} })
		}
		let user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ errors: {"username or password": "is invalid"} });
		}
		// if (!await user.checkPassword(password)) {
		if (!user.checkPassword(password)) { // TODO: use async version
			return res.status(401).json({ errors: {"username or password": "is invalid"} });
		}
		const token = jwt.getToken(username);
		res.json({ token, user: user.toJSON(true) });
	}),
}
