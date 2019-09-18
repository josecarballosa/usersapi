const http = require('http');
const { port } = require('./utils/settings');
const logger = require('./bootstrap/winston');
const listener = require('./app');

const mongoDB = require('./bootstrap/mongoDB');

logger.info('creating the server');
const server = http.createServer(listener);

logger.info('setting server error handler');
server.on('error', handleServerErrors);

logger.info('connecting the database');
mongoDB(() => {
	logger.info('starting server listening');
	server.listen(port);

	console.log(`Server listening on port ${port}`);
});

function handleServerErrors(error) {
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

module.exports = server; // for testing
