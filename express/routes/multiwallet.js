module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var Promise = require("bluebird");
  var collection = require('lodash/collection')
  var mc = require('../multichain/index');

  /* GET wallets */
  router.get('/', function(req, res, next) {
  });

  router.get('/create', function(req, res, next) {
  });

  io.on('connection', function(socket) {
    socket.on('address-track', function (msg) {
      console.log(msg.address)
    });
  });

  return router;
}
