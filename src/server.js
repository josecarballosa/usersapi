const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');

const { env, port } = require('./utils/settings');
const logger = require('./utils/logger');
const { requestLogger } = require('./middleware');

const database = require('./utils/database');

const routes = require('./routes');

logger.info('creating the express app');
const app = express();

logger.info('loading middleware to support CORS');
app.use(cors());

logger.info('loading middleware to support method override');
app.use(methodOverride());

logger.info('loading middleware to parse json request bodies');
app.use(express.json());

logger.info('loading middleware to parse url-encoded request bodies');
app.use(express.urlencoded({ extended: true }));

logger.info('loading a handler for body parser errors');
app.use(handleBodyParserErrors);

if (env === 'development') {
	logger.info('loading middleware to log http requests');

	app.use(requestLogger.success);
	app.use(requestLogger.error);
}

logger.info('loading a handler for serving static pages');
app.use(express.static('public'));

logger.info('loading a router to serve api routes');
app.use('/api', routes);

logger.info('loading a handler for unknown page requests');
app.all('*', handlePageNotFound);

logger.info('loading a handler for internal errors');
app.use(handleInternalError);

logger.info('loading a handler for server listening errors');
app.on('error', handleServerListeningError);

logger.info('connecting to the database');
database.connect(() => {
	logger.info('starting server');
	app.listen(port);
	console.log(`Server listening on port ${port}`);
});

function handleServerListeningError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	logger.error('handling server listening error: %O', error);

	switch (error.code) {
		case 'EADDRINUSE':
			logger.error(`Port ${port} is already in use`);
			process.exit(1);
			break;
		case 'EACCES':
			logger.error(`Port ${port} requires elevated privileges`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function handlePageNotFound(req, res, next) {
	logger.error('handling unknown page error: %O', {
		method: req.method,
		url: req.url,
	});

	res.status(404).send();
}

function handleInternalError(err, req, res, next) {
	logger.error('handling internal error: %O', err);

	res.status(500).json({ message: 'something went wrong' });
}

function handleBodyParserErrors(err, req, res, next) {
	if (err.type === 'entity.parse.failed') {
		logger.error('handling body parser error: %O', err);

		return res.status(400).json({
			message: 'invalid data',
			errors: { body: 'is malformed' },
		});
	}
	next(err);
}
