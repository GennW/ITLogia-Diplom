const express = require('express');
const UserController = require("../controllers/user.controller");
const router = express.Router();
const Auth = require("../utils/common/auth");

router.get('/', Auth.authenticate, UserController.getUser);

module.exports = router;