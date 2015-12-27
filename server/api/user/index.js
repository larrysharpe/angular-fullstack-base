'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

///// Get Routes
router.get('/broadcasters/favorites', auth.isAuthenticated(), controller.broadcastersFavorites);
router.get('/broadcasters/trending', controller.broadcastersTrending);
router.get('/broadcasters/picks',  controller.broadcastersPicks);
router.get('/broadcasters/online', controller.broadcastersOnline);
router.get('/broadcasters/offline', controller.broadcastersOffline);
router.get('/broadcasters/:slug', controller.getBroadcaster);
router.get('/resendVerification/:id', controller.resendVerification);
router.get('/guest', controller.guest);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id/faves', auth.isAuthenticated(), controller.listFaves);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/', auth.hasRole('admin'), controller.index);


////Post Routes
router.post('/:id/faves/set', controller.setFaves);
router.post('/:id/faves/unset', controller.unsetFaves);
router.post('/verify', controller.verifyEmail);
router.post('/applyBroadcaster', auth.isAuthenticated(), controller.applyBroadcaster)
router.post('/approveBroadcaster', auth.hasRole('admin'), controller.approveBroadcaster);
router.post('/denyBroadcaster', auth.hasRole('admin'), controller.denyBroadcaster);
router.post('/accountHelp', controller.accountHelp);
router.post('/passwordReset', controller.passwordReset);
router.post('/buyTokens', controller.buyTokens);
router.post('/', controller.create);


////Put Routes
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/changeEmail', auth.isAuthenticated(), controller.changeEmail);
router.put('/changeProfile', auth.isAuthenticated(), controller.changeProfile);


//// Delete Routes
router.delete('/:id', auth.hasRole('admin'), controller.destroy);




module.exports = router;
