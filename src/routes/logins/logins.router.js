const router = require('express').Router();
const controller = require('./logins.controller');
const logger = require('../../bootstrap/winston');

logger.info('loading route handler: POST /logins');
router.post('/', controller.createLogin);

module.exports = router;
