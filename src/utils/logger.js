const winston = require('winston');
const { combine, timestamp, colorize, printf, splat, ms } = winston.format;
const { logLevel } = require('./settings');

const logger = winston.createLogger({
	transports: [new winston.transports.Console({ level: logLevel })],
	format: combine(
		// timestamp(),
		ms(),
		splat(),
		colorize({ all: false }),
		printf(
			// info => `${info.timestamp} ${info.level}: ${info.message} ${info.ms}`,
			info => `${info.level}: ${info.message} ${info.ms}`,
		),
	),
});

module.exports = logger;
