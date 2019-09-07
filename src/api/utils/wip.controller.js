module.exports = {

	handleParam: async (req, res, next, param) => {
		// TODO: add debug log here with route details
		res.status(501).json({ errors: {"method": "not implemented"} });
	},

	handleRequest: async (req, res, next) => {
		// TODO: add debug log here with route details
	  res.status(501).json({ errors: {"method": "not implemented"} });
	}
}
