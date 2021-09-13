const router = require("express").Router();
const controller = require("./refresh.controller");
const methodNotAllowed = require('../errors/methodNotAllowed');

router
.route('/logout')
.delete(controller.logout)
.all(methodNotAllowed)

router
.route('/login')
.post(controller.login)
.all(methodNotAllowed)

router
.route('/token')
.post(controller.refresh)
.all(methodNotAllowed)

module.exports = router;