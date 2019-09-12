const db = require('./db');
const bodyParser = require('./body-parser');
const morgan = require('./morgan');
const env = require('../utils/settings').env;
const logger = require('../config/winston');

function config(app) {
	logger.info('configuring the database');
	db();

	logger.info('configuring body-parser middleware');
	bodyParser(app);

	if (env === 'development') {
		logger.info('configuring a request logger for development');
		morgan(app);
	}
}

module.exports = config;
