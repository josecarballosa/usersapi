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
