const EventEmitter = require('events')
const { Contract, LogsSubscriber, QtumRPC } = require('qtumjs')
const config = require('./config')
const swapDef = require('./swap.json')

class Worker extends EventEmitter {
  constructor(opts = {}) {
    super()
    this.id = opts.id
    this.name = opts.name
    this.account = opts.account
    this.accountHex = opts.accountHex
    this.rpc = new QtumRPC(opts.endpoint)
    this.swap = new Contract(rpc, swapDef)
  }

  listen() {
    const event = 'SwapTx(bytes32,uint256,address,uint256)'
    const topic = require('js-sha3').keccak256(event)
    const filter = {
      minconf: 0,
      filter: {
        addresses: [config.atn],
        topics: [topic]
      }
    }

    const eventlogger = new LogsSubscriber(this.rpc, filter)
    const eventDecoder = require('ethjs-abi').logDecoder(swapDef.abi)

    function prefix0x(str) {
      return `0x${str}`
    }

    eventlogger.on((logEntry) => {
      const decodedLog = eventDecoder([{
        data: prefix0x(logEntry.data),
        topics: logEntry.topics.map(prefix0x)
      }])[0]
      const swapTx = {
        fromChain: this.id,
        txIdx: decodedLog.tx_idx.toNumber(),
        toChain: decodedLog.to_chain,
        toAddress: decodedLog.to_address,
        amount: decodedLog.amount.toNumber()
      }
      this.emit('tx', swapTx)
    })
    eventlogger.start()
  }

  prove(proof) {
    const shouldProve = this.swap.call('canProve', [proof.fromChain, proof.txIdx])
  }
}

const worker = new Worker(config)
worker.on('tx', console.log)
worker.listen()
