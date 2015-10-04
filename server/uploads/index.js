'use strict';

var express = require('express');
var controller = require('./uploads.controller');
var auth = require('../auth/auth.service');
var router = express.Router();

router.post('/pics', controller.index);
module.exports = router;
