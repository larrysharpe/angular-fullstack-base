'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

//create
router.post('/', controller.create);
router.post('/admin', auth.hasRole('admin'), controller.createByAdmin);
router.post('/accountHelp', controller.accountHelp);

//read
router.get('/', auth.hasRole('admin'), controller.index);     /// get a list
router.get('/me', auth.isAuthenticated(), controller.me);     /// a user getting their own data
router.get('/:id', auth.isAuthenticated(), controller.show);  /// get a single user
router.get('/resetToken/:token', controller.resetToken);
router.get('/verifyEmail/:token', controller.emailVerificationToken);
router.get('/resendEmailVerification/:email', controller.resendEmailVerification);

//update
router.put('/:id', auth.hasRole('admin'), controller.editByAdmin);
router.put('/:id/passwordreset/:token', controller.changePasswordReset);
////update individual fields
var updateRoutes = ['email', 'password', 'username'];
for (var r in updateRoutes){
  var route = '/:id/' + updateRoutes[r];
  var method = controller['change' + updateRoutes[r]];
  router.put(route, auth.isAuthenticated(), method);
}

//delete
router.delete('/:id', auth.hasRole('admin'), controller.destroy);


module.exports = router;
