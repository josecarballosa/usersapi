const morgan = require('morgan');
const debug = require('../utils/debug');

function config(app) {
	debug.info('loading request logger middleware');
	app.use(morgan('dev', { stream: { write: msg => debug.info(msg) } }));
}

module.exports = config;
