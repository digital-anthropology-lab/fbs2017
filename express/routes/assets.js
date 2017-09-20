module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var mc = require('../multichain/index');

  /* GET assets page. */
  router.get('/', function(req, res, next) {

    mc.listAssets(function(err, data){
      console.log('assets', data);
      res.render('assets', { title: "Assets", assets : data });
    });

  });

  router.get('/:name', function(req, res, next) {

    mc.listAssets({asset: req.params.name, verbose: true}, function(err, data){
      res.render('assets', { title: "Assets", assets : data });
    });

  });

  router.get('/new/:name/:qty/:address', function(req, res, next) {

    // mc.listAssetsPromise()
    //   .then(function(data){
    //     // if()
    //     // res.render('assets', { title: "Assets", assets : data });
    //   })

    mc.issuePromise({
      address: req.params.address,
      asset: {
        name: req.params.name,
        open: true
      },
      qty: parseInt(req.params.qty),
      units: 0.1
    }).then(function(data){
      console.log(data)
      res.render('assets', { title: "Issue Asset", assets : data });
    }).error(function(e){
      console.log(e)
    });

  });

  return router;
}
