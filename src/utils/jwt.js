const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { secret, expiresIn } = require('./settings');
const wrap = require('./wrap');

const auth = 'auth';

function getToken(username) {
	return jwt.sign({ username }, secret, { expiresIn });
}

const optional = wrap(
	expressJwt({ credentialsRequired: false, secret, requestProperty: auth }),
);

const required = wrap(
	expressJwt({ credentialsRequired: true, secret, requestProperty: auth }),
);

module.exports = { getToken, optional, required };

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
