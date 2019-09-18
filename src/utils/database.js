const mongoose = require('mongoose');
const { env, databaseUrl } = require('./settings');
const logger = require('./logger');

function connect(done) {
	logger.info('loading a handler for database connection');
	mongoose.connection.on('connected', () => {
		logger.info('database connected');
	});

	logger.info('loading a handler for database disconnection');
	mongoose.connection.on('disconnected', () => {
		logger.warn('database disconnected');
	});

	logger.info('loading a handler for database reconnection');
	mongoose.connection.on('reconnected', () => {
		logger.warn('database reconnected');
	});

	logger.info('loading a handler for database closing');
	mongoose.connection.on('close', () => {
		logger.info('database closed');
	});

	logger.info('loading a handler for database connection errors');
	mongoose.connection.on('error', error => {
		logger.error('database error: ' + error);
	});

	(async () => {
		try {
			logger.info('opening the database connection');
			await mongoose.connect(databaseUrl, {
				useNewUrlParser: true,
				useCreateIndex: env !== 'production',
				autoReconnect: true,
				reconnectTries: 1000000,
				reconnectInterval: 3000,
				// poolSize: 5, // increase if I have slow queries that  block faster queries,
				//keepAlive: true, keepAliveInitialDelay: 300000, // to avoid "connection closed" errors in long running applications for what seems like no reason
			});
			// mongoose.connection.once('open', done);
			done();
		} catch (error) {
			logger.error('caught database connection error: %O', error);
			handleDBConnectionError();
		}
	})();
}

async function handleDBConnectionError() {
	logger.error('handling database connection error');
	if (mongoose.connection) {
		logger.error('closing database connection');
		await mongoose.connection.close();
	}
	logger.error('exiting the process');
	process.exit();
}

module.exports = { connect };
