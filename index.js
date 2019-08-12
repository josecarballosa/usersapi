const http = require('http');

const app = require('./app');
const { port } = require('./config');

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onListening() {
	const addr = server.address();
	const binding = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Server listening on ' + binding);
}

// Log friendly messages for specific listening errors
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const binding = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(binding + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(binding + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

