const router = require('express').Router();
const controller = require('./logins.controller');

router
	.post('/', controller.createLogin);

module.exports = router;