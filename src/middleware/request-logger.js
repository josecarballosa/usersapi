const morgan = require('morgan');
const logger = require('../utils/logger');

const success = morgan('dev', {
	stream: { write: msg => logger.info(msg) },
	skip: (req, res) => res.statusCode >= 400,
});

const error = morgan('dev', {
	stream: { write: msg => logger.error(msg) },
	skip: (req, res) => res.statusCode < 400,
});

module.exports = { success, error };
