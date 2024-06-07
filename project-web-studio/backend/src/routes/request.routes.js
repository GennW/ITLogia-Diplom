const express = require('express');
const RequestController = require("../controllers/request.controller");
const router = express.Router();

router.post('/', RequestController.makeRequest);

module.exports = router;