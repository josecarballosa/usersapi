const router = require('express').Router();

const controller = require('./users.controller');
const { jwt, auth } = require('../../utils');
const logger = require('../../config/winston');

logger.info('loading route param handler: /users/:username ');
router.param('username', controller.findUser);

let route = router.route('/');

logger.info('loading route handler: POST /users');
route.post(controller.createUser);

logger.info('loading route handler: GET /users');
route.get(controller.getAllUsers);

route = router.route('/:username');

logger.info('loading route handler: GET /users/:username');
route.get(jwt.optional, auth.load, controller.getOneUser);

logger.info('loading route handler: PUT /users/:username');
route.put(jwt.required, auth.load, controller.updateUser);

logger.info('loading route handler: DELETE /users/:username');
route.delete(jwt.required, auth.load, controller.deleteUser);

module.exports = router;
