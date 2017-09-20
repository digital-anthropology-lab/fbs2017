"use strict";

const connection = {
    port: 6602,
    host: '127.0.0.1',
    // host: '10.132.209.212',
    user: "chain001",
    pass: "chain001"
};

const bluebird = require("bluebird");
const multichain = bluebird.promisifyAll(require("multichain-node")(connection), {suffix: "Promise"});

module.exports = multichain;
