'use strict';

var express = require('express');
var controller = require('./show.controller.js');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id', controller.show);
router.get('/', controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
