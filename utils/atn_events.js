#!/usr/bin/env node

const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')
const abi = require('../abis/ATN.json').contracts['atn-contracts/ATN.sol']
const atn = new Contract(rpc, abi)

atn.onLog(console.log, { minconf: 1 })
