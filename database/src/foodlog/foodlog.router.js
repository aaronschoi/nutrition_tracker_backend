const router = require("express").Router();
const controller = require("./foodlog.controller");
const methodNotAllowed = require('../errors/methodNotAllowed');

router
.route('/')
.post(controller.addFood)
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed)

router
.route('/:userid')
.get(controller.readLogs)
.all(methodNotAllowed)

module.exports = router;