module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var Promise = require("bluebird");
  var collection = require('lodash/collection')
  var mc = require('../multichain/index');

  var ownAddress = ""

  router.get('/create', function(req, res, next) {
    var p1 = mc.getLocalChainUsers()
    var p2 = mc.listAssetsPromise()
    Promise.join(p1, p2).then(function(data){
      console.log(data[1])
      var address = data[0].filter(function(item){ return item.ismine })
      // res.send(JSON.stringify(address[0]))
      res.render('job-create', { title: "Multisignature Transaction", address: address[0], assets: data[1]});
    })
  })

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
          key: req.body.asset,
          data: new Buffer(encoded).toString("hex")
        })
      })
      .then(function(data){
        res.send(JSON.stringify(data))
      }, function(e){
        res.send(JSON.stringify(e))
      })

  });

  // List all jobs or filter by key
  router.get('/:key*?', function(req, res, next) {
    var fn = req.params.key
      ? mc.listStreamKeyItemsPromise
      : mc.listStreamItemsPromise

    fn({
      stream: "jobs:new",
      key: req.params.key,
      verbose: true
    }).then(function(data){
      data.forEach(function(item, i){
        data[i].dataStr = JSON.parse(Buffer.from(item.data, 'hex').toString())
      })
      res.render('jobs-available', { title: "Jobs Available", streams : data });
      // res.send(JSON.stringify(data))
    });

  })


  io.on('connection', function(socket) {
    socket.on('address-track', function (msg) {
      console.log(msg.address)
    });
  });

  return router;
}
