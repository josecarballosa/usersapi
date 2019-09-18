const morgan = require('morgan');
const logger = require('./winston');

function bootstrap(app) {
	logger.info('loading middleware to log http requests');

	app.use(
		morgan('dev', {
			stream: { write: msg => logger.info(msg) },
			skip: (req, res) => res.statusCode >= 400,
		}),
	);

	app.use(
		morgan('dev', {
			stream: { write: msg => logger.error(msg) },
			skip: (req, res) => res.statusCode < 400,
		}),
	);
}

module.exports = bootstrap;
