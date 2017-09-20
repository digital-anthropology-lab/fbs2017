module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var Promise = require("bluebird");
  var collection = require('lodash/collection')
  var mc = require('../multichain/index');

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    mc.getLocalChainUsers().then(function(addresses){
      res.render('users', { title: "Users", addresses : addresses });
    });
  });

  router.get('/create', function(req, res, next) {
    mc.createKeyPairs(function(err, data){
      res.render('users-create', { title: "User - Create Key Pair", keypair : data });
    });
  });

  io.on('connection', function(socket) {
    socket.on('address-track', function (msg) {
      console.log(msg.address)

      mc.importAddressPromise({address: msg.address, label : 'test-name', rescan: false})
        .then(function(){

          mc.getLocalChainUsers()
            .then(function(addresses){
              return mc.publishFromPromise({
                from: addresses[0].address,
                stream: "root",
                key: "user:tracking",
                data: new Buffer(`New address tracked ${msg.address}`).toString("hex")
              })
            })
        })

    });
  });

  return router;
}
