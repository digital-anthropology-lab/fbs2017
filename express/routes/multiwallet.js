module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var Promise = require("bluebird");
  var collection = require('lodash/collection')
  var mc = require('../multichain/index');

  var ownAddress = ""

  /* GET wallets */
  router.get('/create', function(req, res, next) {
    mc.getLocalChainUsers()
      .then(function(data){
        var address = data.filter(function(item){ return item.ismine })
        ownAddress = address[0].address
        res.render('multiwallet', { title: "Multisignature Transaction", address: address[0]});
        // res.send(JSON.stringify(address[0]))
      })
  });

  function trackAddresses(addresses){
    var promises = [];
    for(var i = 0; i < addresses.length; i++){
      console.log(addresses[i])
      promises.push(mc.importAddressPromise({address: addresses[i], label : 'user:tracked', rescan: false}))
    }
    return Promise.all(promises)
  }

  router.post('/create', function(req, res, next) {

    // mc.createMultiSigPromise({
    //   nrequired: 2,
    //   keys: ["1Muwp61n9PxAgyUZ87BqT17d3Mn1v7cyD5Qi1Q", "1VAYMFUSRZ7LKGvAoBdTJm71gdNjQsf7bWDZf7"]
    // }).then(function(data){
    //   console.log(data)
    // }, function(e){
    //   console.log(e)
    // })

    var encoded = JSON.stringify({
      numowners : Math.max(2, req.body.numowners),
      description : req.body.description,
      owners: [ownAddress],
      value : req.body.jobvalue
    })

    mc.getLocalChainUsers()
      .then(function(addresses){
        return mc.publishFromPromise({
          from: addresses[0].address,
          stream: "jobs:new",
          key: "job",
          data: new Buffer(encoded).toString("hex")
        })
      })
      .then(function(data){
        res.send(JSON.stringify(data))
      }, function(e){
        res.send(JSON.stringify(e))
      })

  });

  io.on('connection', function(socket) {
    socket.on('address-track', function (msg) {
      console.log(msg.address)
    });
  });

  return router;
}
