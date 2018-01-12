#!/usr/bin/env node

const { LogsSubscriber, QtumRPC } = require('qtumjs')
const Decoder = require('ethjs-abi').logDecoder

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const atnAddress = require('../abis/ATN.json')
  .contracts['atn-contracts/ATN.sol'].address

const abi = require('../abis/SWAP.json')
  .contracts['Swap.sol'].abi
const decoder = Decoder(abi)

const event = 'SwapTx(bytes32,uint256,address,uint256)'
const topic = require('js-sha3').keccak256(event)
const filter = {
  minconf: 1,
  filter: {
    addresses: [atnAddress],
    topics: [topic]
  }
}

const eventlogger = new LogsSubscriber(rpc, filter)
eventlogger.on((logEntry) => {
  const decodedLogs = decoder([{
    data: prefix0x(logEntry.data),
    topics: logEntry.topics.map(prefix0x)
  }])
  const tx = {
    to_chain: decodedLogs[0].to_chain,
    tx_idx: decodedLogs[0].tx_idx.toNumber(),
    to_address: decodedLogs[0].to_address,
    amount: decodedLogs[0].amount.toNumber()
  }
  console.log(tx)
})
eventlogger.start()

function prefix0x(str) {
  return `0x${str}`
}
