const db = require('./db');
const bodyParser = require('./body-parser');
const morgan = require('./morgan');
const env = require('../utils/settings').env;
const debug = require('../utils/debug');

function config(app) {
	debug.info('configuring the database');
	db();

	debug.info('configuring body-parser middleware');
	bodyParser(app);

	if (env === 'development') {
		debug.info('configuring request logger middleware on dev');
		morgan(app);
	}
}

module.exports = config;
