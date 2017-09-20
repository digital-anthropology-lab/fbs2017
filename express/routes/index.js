module.exports = function(io) {

  var express = require('express');
  var router = express.Router();
  var mc = require('../multichain/index');

  var latestBlockHeight = 0;

  // io.on('connection', function(socket) {
  //   console.log('connection success')
  //   socket.on('private message', function (from, msg) {
  //     console.log('I received a private message by ', from, ' saying ', msg);
  //   });
  // });

  // Test connection.
  // mc.getInfo(function(err, data){
  //   if(err) throw err
    // console.log(data)
  // })

  /* GET home page. */
  router.get('/', function(req, res, next) {
    mc.getInfo(function(err, data){
      res.render('index', { title: data.description, mc : data });
    })
  });


  function getLatestBlock(){
    mc.getInfo(function(err, data){
      if(err) throw err
      // console.log(err, data)
      if(data.blocks > latestBlockHeight){
        latestBlockHeight = data.blocks;
        mc.getBlockHash({height: latestBlockHeight}, function(err, blockHash) {
          mc.getBlock({hash: blockHash}, function(err, block) {
            if(err) throw err
            io.emit('block-new', block);
          });
        });
      }
    })
  }

  setInterval(getLatestBlock, 500);

  return router;
}
