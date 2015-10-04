'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/verify', controller.verifyEmail);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/resendVerification/:id', controller.resendVerification);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/', controller.create);
router.post('/accountHelp', controller.accountHelp);
router.post('/passwordReset', controller.passwordReset);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/changeEmail', auth.isAuthenticated(), controller.changeEmail);
router.put('/changeProfile', auth.isAuthenticated(), controller.changeProfile);

router.post('/applyBroadcaster', auth.isAuthenticated(), controller.applyBroadcaster)
router.post('/approveBroadcaster', auth.hasRole('admin'), controller.approveBroadcaster);
router.post('/denyBroadcaster', auth.hasRole('admin'), controller.denyBroadcaster);

router.get('/broadcasters/favorites', auth.isAuthenticated(), controller.broadcastersFavorites);
router.get('/broadcasters/trending', controller.broadcastersTrending);
router.get('/broadcasters/picks',  controller.broadcastersPicks);
router.get('/broadcasters/online', controller.broadcastersOnline);
router.get('/broadcasters/offline', controller.broadcastersOffline);
router.get('/broadcasters/:slug', controller.getBroadcaster);

module.exports = router;
