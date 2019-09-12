const dotenvError = require('dotenv').config().error;
if (dotenvError) {
	throw dotenvError;
}

const settings = {
	env: process.env.NODE_ENV,
	port: normalizePort(process.env.PORT || '3000'),
	logLevel: process.env.LOG_LEVEL || 'info',
	mongoUrl: process.env.MONGO_URL,
	saltRounds: process.env.NODE_ENV === 'production' ? 10 : 1,
	secret: process.env.JWT_SECRET,
	expiresIn: process.env.JWT_EXPIRES_IN,
	sensitiveFields: ['password', 'hash'],
};

// Normalize a port value into a number, string, or false.
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		return val; // named pipe
	}
	if (port >= 0) {
		return port; // port number
	}
	return false;
}

module.exports = settings;
