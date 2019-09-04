const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { secret, expiresIn } = require('../../config');
const asyncHandler = require('./async-handler');

const auth = 'auth';

/*
function expressJwt({ credentialsRequired, secret, requestProperty = auth }) {
	return async function (req, res, next) {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			if (credentialsRequired) {
				return res.status(401).json({ errors: {"authorization": "is missing"} });
			} else {
				return next();
			}
		}
		const [ lead, token ] = authorizationHeader.split(' ');
		if (lead !== 'Token' && lead !== 'Bearer') {
			return res.status(401).json({ errors: {"authorization": "is invalid"} });
		}
		try {
			req[requestProperty] = jwt.verify(token, secret);
			next();
		}
		catch (error) {
			return res.status(401).json({ errors: {"authorization": error.message }});
		}
	}
}
*/

module.exports = {
	getToken: (username) => jwt.sign({ username }, secret, { expiresIn }),

	optional: asyncHandler(
		expressJwt({ credentialsRequired: false, secret, requestProperty: auth })
	),

	required: asyncHandler(
		expressJwt({ credentialsRequired: true, secret, requestProperty: auth })
	),

};
