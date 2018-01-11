// #!/usr/bin/env node
//
// const args = process.argv.slice(2)
//
// if (args.length < 1) {
//   console.log('Usage:\n\tregister_chain <chainName>')
//   process.exit(1)
// }

const colors = require('colors')
const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const abi = require('../abis/SWAP.json').contracts['Swap.sol']

const swap = new Contract(rpc, abi)

async function registerChain(chainID) {
  let c = await swap.call('dstChains', [chainID])
  console.log(colors.green('=====>Check register before:'))
  console.log(c.outputs)
  console.log()

  const tx = await swap.send('registerChain', [chainID])
  console.log(colors.green('=====>Sent tx:'))
  console.log(JSON.stringify({
    txid: tx.txid,
    method: tx.method,
    fee: tx.fee,
    confirmations: tx.confirmations
  }, null, 2))
  console.log()

  console.log(colors.green('=====>Waiting for transaction confirmation...'))
  console.log()
  await tx.confirm(1)

  c = await swap.call('dstChains', [chainID])
  console.log(colors.green('=====>Check register after:'))
  console.log(c.outputs)
  console.log()
}

function string2bytes32(str) {
  const hex = Buffer.from(str).toString('hex')
  const pad = Array(65 - hex.length).join('0')
  return `0x${pad}${hex}`
}

module.exports = async (chainName) => {
  const chainID = string2bytes32(chainName)
  const alloc = require('./allocQtum')
  await alloc(swap.info.sender, 0.01)
  await registerChain(chainID)
}
// module.exports(...args)
