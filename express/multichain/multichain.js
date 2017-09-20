"use strict";

const connection = {
    port: 6603,
    host: '127.0.0.1',
    // host: '10.132.209.212',
    user: "chain001",
    pass: "chain001"
};

const collection = require('lodash/collection')
const Promise = require("bluebird");
const multichain = Promise.promisifyAll(require("multichain-node")(connection), {suffix: "Promise"});

multichain.getLocalChainUsers = () => {
  //
  // var p1 = mc.listAddressesPromise();
  // var p2 = mc.listPermissionsPromise();
  // var p3 = mc.getMultiBalancesPromise();
  //
  // Promise.join(p1, p2, p3,
  //   function(addresses, permissions, balances){
  //     console.log("BALANCES")
  //     console.log(balances)
  //     console.log("=============")
  //     addresses.forEach(function(item){
  //       item.permissions = collection.filter(permissions, {address: item.address});
  //     });
  //     balances.forEach(function(item){
  //       console.log(item);
  //       // item.permissions = collection.filter(permissions, {address: item.address});
  //     });
  //   })
}


module.exports = multichain;
