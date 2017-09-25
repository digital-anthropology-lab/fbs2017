module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var mc = require('../multichain/index');

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    mc.listStreamsPromise()
      .then(function(data){
        res.render('streams', { title: "Streams", streams : data });
      });
  });

  router.get('/create/:sname', function(req, res, next) {
    mc.createPromise({name:req.params.sname, open: true})
      .then(function(data){
        res.send(JSON.stringify(data))
      }, function(e){
        res.send(JSON.stringify(e))
      })
  });

  router.get('/:stream/:key*?', function(req, res, next) {
    var fn = req.params.key
      ? mc.listStreamKeyItemsPromise
      : mc.listStreamItemsPromise

    fn({
      stream: req.params.stream,
      key: req.params.key,
      verbose: true
    }).then(function(data){
      data.forEach(function(item, i){
        data[i].dataStr = Buffer.from(item.data, 'hex');
      })
      // res.send(JSON.stringify(data))
      res.render('stream', { title: "Streams", streams : data });
    });
  });

  return router;
}
