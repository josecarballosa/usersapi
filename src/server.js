const http = require('http');
const port = require('./utils/settings').port;
const debug = require('./utils/debug');
const listener = require('./app');

debug.info('creating server');
const server = http.createServer(listener);

debug.info('setting server error handler');
server.on('error', handleServerErrors);

debug.info('starting server listening');
server.listen(port);

console.log(`Server listening on port ${port}`);

function handleServerErrors(error) {
	debug.error('the server error handler was called');
	debug.error('error: %O', error);
	if (error.syscall !== 'listen') {
		throw error;
	}
	switch (error.code) {
		case 'EADDRINUSE':
			console.error(`Port ${port} is already in use`);
			process.exit(1);
			break;
		case 'EACCES':
			console.error(`Port ${port} requires elevated privileges`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

module.exports = server; // for testing
