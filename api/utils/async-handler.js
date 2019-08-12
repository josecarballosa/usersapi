module.exports = (fn) =>
	// (req, res, next) =>
	(...args) =>
		Promise
			.resolve( fn(...args) )
			.catch(args[2]);