const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const bodyParser = require('./bootstrap/body-parser');
const logger = require('./bootstrap/winston');
const morgan = require('./bootstrap/morgan');
const { env } = require('./utils/settings');
const routes = require('./routes');


logger.info('creating the express app');
const app = express();

logger.info('loading middleware to support CORS');
app.use(cors());

logger.info('loading middleware to support method override');
app.use(methodOverride());

logger.info('configuring body-parser middleware');
bodyParser(app);

if (env === 'development') {
	logger.info('configuring a request logger for development');
	morgan(app);
}

logger.info('loading a handler for serving static pages');
app.use(express.static('public'));

logger.info('loading a router to serve api routes');
// app.use('/api', require('./routes'));
app.use('/api', routes);

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
