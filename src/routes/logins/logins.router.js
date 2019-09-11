const router = require('express').Router();
const controller = require('./logins.controller');
const debug = require('../../utils/debug');

debug.info('loading /logins route handlers');
router.post('/', controller.createLogin);

module.exports = router;
