const router = require('express').Router();

const controller = require('./users.controller');
const { jwt, auth } = require('../utils');

router
	.param('username', controller.findUser);

router.route('/')
	.post(controller.createUser)
	.get(controller.getAllUsers);

router.route('/:username')
	.get(jwt.optional, auth.load, controller.getOneUser)
	.put(jwt.required, auth.load, controller.updateUser)
	.delete(jwt.required, auth.load, controller.deleteUser);

module.exports = router;