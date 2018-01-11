#!/usr/bin/env node

const args = process.argv.slice(2)

if (args.length < 1) {
  console.log('Usage:\n\tget_out_txs <index>')
  process.exit(1)
}

const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const abi = require('../abis/SWAP.json').contracts['Swap.sol']

const swap = new Contract(rpc, abi)

async function getOutTx(idx) {
  let res = await swap.call('outTxs', [idx])
  console.log(JSON.stringify(res.outputs,null,2))
}

getOutTx(...args)
