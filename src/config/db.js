const mongoose = require('mongoose');
const { env, mongoUrl } = require('../utils/settings');
const debug = require('../utils/debug');

async function config() {
	try {
		debug.info('opening database connection');
		await mongoose.connect(mongoUrl, {
			useNewUrlParser: true,
			useCreateIndex: env !== 'production',
			// poolSize: 5, // increase if I have slow queries that  block faster queries,
			//keepAlive: true, keepAliveInitialDelay: 300000, // to avoid "connection closed" errors in long running applications for what seems like no reason
		});

		debug.info('setting database error handling');
		mongoose.connection.on('error', handleDBConnectionError);
	} catch (error) {
		debug.error('database error was thrown');
		debug.error('database error: %O', error);
		handleDBConnectionError();
	}
}

async function handleDBConnectionError() {
	debug.error('database error handler was called');
	if (mongoose.connection) {
		debug.error('closing database connection');
		await mongoose.connection.close();
	}
	debug.error('exiting the process');
	process.exit();
}

module.exports = config;
