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

  router.get('/:stream', function(req, res, next) {
    mc.listStreamItemsPromise({
      stream: req.params.stream,
      verbose: true
    }).then(function(data){
        console.log(data)
        res.render('stream', { title: "Streams", streams : data });
      });
  });

  // router.get('/new', function(req, res, next) {
  //   mc.createPromise({name:'global', open: false})
  //     .then(function(){
  //       return mc.listStreamsPromise();
  //     })
  //     .then(function(data){
  //       res.render('streams', { title: "Streams", streams : data });
  //     })
  // });

  return router;
}
