const router = require("express").Router();
const controller = require("./user.controller");
const methodNotAllowed = require('../errors/methodNotAllowed');

router
.route('/')
.get(controller.getUser)
.post(controller.createUser)
.put(controller.update)
.all(methodNotAllowed)

router
.route('/admin')
.get(controller.ez)
.post(controller.list)
.delete(controller.delete)
.all(methodNotAllowed)

module.exports = router;