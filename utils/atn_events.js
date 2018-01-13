#!/usr/bin/env node

const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')
const abi = require('../abis/ATN.json').contracts['atn-contracts/ATN.sol']
const atn = new Contract(rpc, abi)
const filter = {
  minconf: 1,
  filter: {
    topics: [ 'b59f7b724da168b05632a3bbdc14f14e781e43d42755712d894530eccb4345c2' ]
  }
}

atn.logs(filter).then(console.log)
