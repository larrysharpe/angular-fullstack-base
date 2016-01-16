/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Tips = require('./tips.model');

exports.register = function(socket) {
  Tips.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Tips.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('tips:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('tips:remove', doc);
}