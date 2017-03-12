/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});



var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var xoauthoptions = {
  user: 'admin@capital-mark.com',
  clientId: '218668675591-58rbbt3v4k9pc1erilqtopmfiplg1t9p.apps.googleusercontent.com',
  clientSecret: 'dXd3luCX-EIasUiEh-f0cMJE',
  refreshToken: '1/SGR4zAhYdEFswHcckgsGn26jwspD8ki3JdNsjl_8Z3c'
};

var mailoptions = {
  to: 'larry.l.sharpe@gmail.com',
  from: 'admin@capital-mark.com',
  subject: 'nodemailer test',
  text: 'Hello World'
};

var transportoptions = {
  service: 'gmail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator(xoauthoptions)
  }
};

var transporter = nodemailer.createTransport(transportoptions);
transporter.sendMail(mailoptions, function(err, res){
  if(err){
    console.log('Error: ', err);
  } else {
    console.log('Email Sent');
  }
});


// Expose app
exports = module.exports = app;
