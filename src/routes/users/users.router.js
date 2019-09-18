const router = require('express').Router();

const controller = require('./users.controller');
const { jwt, auth } = require('../../middleware');
const logger = require('../../utils/logger');

logger.info('loading a handler for route param: /users/:username ');
router.param('username', controller.findUser);

let route = router.route('/');

logger.info('loading a handler for route: POST /users');
route.post(controller.createUser);

logger.info('loading a handler for route: GET /users');
route.get(controller.getAllUsers);

route = router.route('/:username');

logger.info('loading a handler for route: GET /users/:username');
route.get(jwt.optional, auth.load, controller.getOneUser);

logger.info('loading a handler for route: PUT /users/:username');
route.put(jwt.required, auth.load, controller.updateUser);

logger.info('loading a handler for route: DELETE /users/:username');
route.delete(jwt.required, auth.load, controller.deleteUser);

module.exports = router;
