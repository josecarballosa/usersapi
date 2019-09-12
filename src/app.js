const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const logger = require('./config/winston');

const config = require('./config');

logger.info('creating the express app');
const app = express();

logger.info('loading middleware to support CORS');
app.use(cors());

logger.info('loading middleware to support method override');
app.use(methodOverride());

logger.info('performing app specific configuration');
config(app);

logger.info('loading a handler for serving static pages');
app.use(express.static('public'));

logger.info('loading a router to serve api routes');
app.use('/api', require('./routes'));

logger.info('loading a handler for unknown page requests');
app.all('*', handleNotFound);

logger.info('loading a handler for internal errors');
app.use(handleInternalErrors);

function handleNotFound(req, res, next) {
	logger.error('handling unknown page error: %O', {
		method: req.method,
		url: req.url,
	});

	res.status(404).send();
}

function handleInternalErrors(err, req, res, next) {
	logger.error('handling internal error: %O', err);

	res.status(500).json({ message: 'something went wrong' });
}

module.exports = app;
