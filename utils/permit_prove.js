// #!/usr/bin/env node
//
// const args = process.argv.slice(2)
//
// if (args.length < 1) {
//   console.log('Usage:\n\tpermit_prove address')
//   process.exit(1)
// }

const colors = require('colors')
const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const proveSig = '0x4c88384a'

const abi = require('../abis/AUTHORITY.json').contracts['Authority.sol']
const swapAddress = require('../abis/SWAP.json').contracts['Swap.sol'].address
const authority = new Contract(rpc, abi)


async function permitProve(addr) {
  let p = await authority.call('canCall', [addr, swapAddress, proveSig])
  console.log(colors.green('=====>Prove permission before:'))
  console.log(p.outputs)
  console.log()

  const tx = await authority.send('permit', [addr, swapAddress, proveSig])
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

  p = await authority.call('canCall', [addr, swapAddress, proveSig])
  console.log(colors.green('=====>Prove permission after:'))
  console.log(p.outputs)
  console.log()
}

module.exports = async (addr) => {
  const alloc = require('./allocQtum')
  await alloc(authority.info.sender, 0.01)
  await permitProve(addr)
}
