'use strict';

var fs = require('fs');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken'),
util = require('util'),
  formidable = require('formidable'),
  TEST_PORT = 9100,
  TEST_TMP = 'client/files';


/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

  var form = new formidable.IncomingForm(),
    fieldsObj = {},
    filesObj = {};

  form.keepExtensions = true;

  form
    .on('field', function(field, value) {
      console.log(field, value);
      if (field === 'slug'){
        form.uploadDir = TEST_TMP + '/'+value;
        if (!fs.existsSync(form.uploadDir)){
          fs.mkdirSync(form.uploadDir);
        }
      }
    })
    .on('file', function(field, file) {
      console.log(field, file);
      filesObj[field] = file;
      fs.rename(file.path, form.uploadDir + "/" + file.name);
    })
    .on('error', function(err) {
    })
    .on('end', function() {
      console.log('-> upload done');
      console.log(filesObj);
      res.redirect('back');
    });
  form.parse(req);

};
