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

  router.get('/create', function(req, res, next) {
    res.render('asset-create', { title: "Create Garment Asset" });
  })

  router.post('/create', function(req, res, next) {

    // mc.listAssetsPromise()
    //   .then(function(data){
    //     // if()
    //     // res.render('assets', { title: "Assets", assets : data });
    //   })

    mc.getLocalChainUsers().then(function(data){
      var address = data.filter(function(item){ return item.ismine })
      return mc.issuePromise({
        address: address[0].address,
        asset: {
          name: req.body.name,
          open: true
        },
        qty: parseInt(req.body.assetvalue),
        units: 1,
        details: {
          "description": req.body.description
        }
      })
    }).then(function(data){
      console.log(data)
      res.render('assets', { title: "Issue Asset success", assets : data });
    }).error(function(e){
      console.log(e)
      res.send(e)
    })

  })

  router.get('/:name', function(req, res, next) {

    mc.listAssets({asset: req.params.name, verbose: true}, function(err, data){
      res.render('assets', { title: "Assets", assets : data });
    });

  });


  return router;
}
