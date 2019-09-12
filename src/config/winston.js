const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, printf, splat, ms } = format;
const { logLevel } = require('../utils/settings');

const logger = createLogger({
	transports: [new transports.Console({ level: logLevel })],
	format: combine(
		timestamp(),
		ms(),
		splat(),
		colorize({ all: true }),
		printf(
			info => `${info.timestamp} [${info.level}] ${info.message} ${info.ms}`,
		),
	),
});

module.exports = logger;
