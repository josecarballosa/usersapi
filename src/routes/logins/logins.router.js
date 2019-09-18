const router = require('express').Router();
const controller = require('./logins.controller');
const logger = require('../../utils/logger');

logger.info('loading a handler for route: POST /logins');
router.post('/', controller.createLogin);

module.exports = router;
