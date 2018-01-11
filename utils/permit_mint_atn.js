// #!/usr/bin/env node
//
// const args = process.argv.slice(2)
//
// if (args.length < 1) {
//   console.log('Usage:\n\tpermit_mint_atn address')
//   process.exit(1)
// }

const { Contract, QtumRPC } = require('qtumjs')
const colors = require('colors')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const mintSig = '0x40c10f19'

const abi = require('../abis/AUTHORITY.json').contracts['Authority.sol']
const atnAddress = require('../abis/ATN.json').contracts['atn-contracts/ATN.sol'].address
// const swapAddress = require('../abi/SWAP.json').contracts['SWAP.sol'].address
const authority = new Contract(rpc, abi)


async function permitMintAtn(addr) {
  let p = await authority.call('canCall', [addr, atnAddress, mintSig])
  console.log(colors.green('=====>Mint permission before:'))
  console.log(p.outputs)
  console.log()

  const tx = await authority.send('permit', [addr, atnAddress, mintSig])
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

  p = await authority.call('canCall', [addr, atnAddress, mintSig])
  console.log(colors.green('=====>Mint permission after:'))
  console.log(p.outputs)
  console.log()
}

module.exports = async (addr) => {
  const alloc = require('./allocQtum')
  await alloc(authority.info.sender, 0.01)
  await permitMintAtn(addr)
}
