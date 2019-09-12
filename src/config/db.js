const mongoose = require('mongoose');
const { env, mongoUrl } = require('../utils/settings');
const logger = require('../config/winston');

async function config() {
	try {
		logger.info('opening the database connection');
		await mongoose.connect(mongoUrl, {
			useNewUrlParser: true,
			useCreateIndex: env !== 'production',
			// poolSize: 5, // increase if I have slow queries that  block faster queries,
			//keepAlive: true, keepAliveInitialDelay: 300000, // to avoid "connection closed" errors in long running applications for what seems like no reason
		});

		logger.info('loading a handler for database connection errors');
		mongoose.connection.on('error', handleDBConnectionError);
	} catch (error) {
		logger.error('catch database connection error: %O', error);
		handleDBConnectionError();
	}
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

module.exports = config;
