const bodyParser = require('./body-parser');
const { env } = require('../utils/settings');
const logger = require('./winston');
const morgan = require('./morgan');
// const mongoDB = require('./mongoDB');

function bootstrap(app) {
	logger.info('configuring body-parser middleware');
	bodyParser(app);

	if (env === 'development') {
		logger.info('configuring a request logger for development');
		morgan(app);
	}

	// logger.info('configuring the database');
	// mongoDB(app);
}

module.exports = bootstrap;
