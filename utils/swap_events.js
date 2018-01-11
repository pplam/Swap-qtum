#!/usr/bin/env node

const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')
const abi = require('../abis/SWAP.json').contracts['Swap.sol']
const swap = new Contract(rpc, abi)

const plainEvent = 'SwapTx(bytes32,uint256,address,uint256)'
const eventSig = require('js-sha3').keccak256(plainEvent)

swap.onLog(console.log, { minconf: 1 })
