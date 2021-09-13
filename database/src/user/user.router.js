const router = require("express").Router();
const controller = require("./user.controller");
const methodNotAllowed = require('../errors/methodNotAllowed');

router
.route('/')
.get(controller.getUser)
.post(controller.createUser)
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed)

router
.route('/admin')
.get(controller.list)
.all(methodNotAllowed)

module.exports = router;