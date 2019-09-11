const router = require('express').Router();

const controller = require('./users.controller');
const { jwt, auth } = require('../../utils');
const debug = require('../../utils/debug');

debug.info('loading /logins/:username param handler');
router.param('username', controller.findUser);

let route = router.route('/');

debug.info('loading POST /logins/:username route handler');
route.post(controller.createUser);

debug.info('loading GET /logins/:username route handler');
route.get(controller.getAllUsers);

route = router.route('/:username');

debug.info('loading GET /logins/:username route handler');
route.get(jwt.optional, auth.load, controller.getOneUser);

debug.info('loading PUT /logins/:username route handler');
route.put(jwt.required, auth.load, controller.updateUser);

debug.info('loading DELETE /logins/:username route handler');
route.delete(jwt.required, auth.load, controller.deleteUser);

module.exports = router;
