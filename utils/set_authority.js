// #!/usr/bin/env node
//
// const args = process.argv.slice(2)
//
// if (args.length < 2) {
//   console.log('Usage:\n\tset_authority \'atn\'|\'swap\' authority_address')
//   process.exit(1)
// }

const colors = require('colors')
const { Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const atnabi = require('../abis/ATN.json').contracts['atn-contracts/ATN.sol']
const swapabi = require('../abis/SWAP.json').contracts['Swap.sol']

const contracts = {
  atn: new Contract(rpc, atnabi),
  swap: new Contract(rpc, swapabi)
}

async function setAuthority(contractName, authorityAddress) {
  const contract = contracts[contractName]

  let a = await contract.call('authority', [])
  console.log(colors.green('=====>Authority before:'))
  console.log(a.outputs)
  console.log()

  const tx = await contract.send('setAuthority', [authorityAddress])
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

  a = await contract.call('authority', [])
  console.log(colors.green('=====>Authority after:'))
  console.log(a.outputs)
  console.log()
}


module.exports = async (cont, auth) => {
  const alloc = require('./allocQtum')
  await alloc(contracts[cont].info.sender, 0.01)
  await setAuthority(cont, auth)
}
