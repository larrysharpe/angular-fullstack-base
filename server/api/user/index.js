'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/accountHelp', controller.accountHelp);
router.put('/:id/passwordreset/:token', controller.changePasswordReset);
router.get('/resetToken/:token', controller.resetToken);
router.get('/verifyEmail/:token', controller.emailVerificationToken);
router.get('/resendEmailVerification/:email', controller.resendEmailVerification);

//user update routes
var updateRoutes = ['email', 'password', 'username'];
for (var r in updateRoutes){
  var route = '/:id/' + updateRoutes[r];
  var method = controller['change' + updateRoutes[r]];
  router.put(route, auth.isAuthenticated(), method);
}

module.exports = router;
