/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Guest = require('./guest.model');

exports.register = function(socket) {
  Guest.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Guest.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('guest:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('guest:remove', doc);
}