"use strict";

const connection = {
    port: 6603,
    host: '127.0.0.1',
    // host: '10.132.209.212',
    user: "chain003",
    pass: "chain003"
};

const Promise = require("bluebird");
const collection = require('lodash/collection')
const multichain = Promise.promisifyAll(require("multichain-node")(connection), {suffix: "Promise"});

// multichain.getInfo(function(err, data){
//   if(err) throw err
//   console.log(data)
// })


const subscribeList = ['jobs:new']
multichain.getLocalChainUsers = () => {

  var p1 = multichain.listAddressesPromise();
  var p2 = multichain.listPermissionsPromise();
  var p3 = multichain.getMultiBalancesPromise();

  return Promise.join(p1, p2, p3,
    function(addresses, permissions, balances){
      addresses.forEach(function(item){
        item.permissions = collection.filter(permissions, {address: item.address});
      });
      addresses.forEach(function(item){
        item.balances = balances[item.address]
      });
      return addresses
    })
}

multichain.addStreams = () => {
  multichain.listStreamsPromise().then(function(data){
    data.forEach(function(item){
      if(subscribeList.indexOf(item.name) > -1 && item.subscribed == false){
        multichain.subscribePromise({
          stream: item.name
        })
      }
    })
  })
}

module.exports = multichain;
