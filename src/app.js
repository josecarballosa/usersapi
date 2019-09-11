const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const debug = require('./utils/debug');

const config = require('./config');

debug.info('creating express app');
const app = express();

debug.info('loading CORS middleware');
app.use(cors());

debug.info('loading method override middleware');
app.use(methodOverride());

debug.info('performing app specific configuration');
config(app);

debug.info('loading static folder middleware');
app.use(express.static('public'));

debug.info('loading router: /');
app.use('/api', require('./routes'));

app.all('*', handleNotFound);

debug.info('loading internal error handler middleware');
app.use(handleInternalErrors);

function handleNotFound(req, res, next) {
	res.status(404).send();
}

function handleInternalErrors(err, req, res, next) {
	debug.error('the internal error handler middleware was called');
	debug.error('err: %O', err);

	debug.error('returning error response');
	res.status(500).json({ message: 'something went wrong' });
}

module.exports = app;
