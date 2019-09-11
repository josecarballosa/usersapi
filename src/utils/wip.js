// TODO: add debug log here with route details

const handleParam = (req, res, next, param) => {
	res.status(501).json({
		message: 'request handler not implemented yet',
		errors: {
			type: 'route param',
			url: req.url,
		},
	});
};

const handleRequest = (req, res, next) => {
	res.status(501).json({
		message: 'request handler not implemented yet',
		errors: {
			type: `${req.method} request`,
			url: req.url,
		},
	});
};

module.exports = { handleParam, handleRequest };
