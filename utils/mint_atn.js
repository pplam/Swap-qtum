// #!/usr/bin/env node
//
// const args = process.argv.slice(2)
// if (args.length < 2) {
//   console.log('Usage:\n\tmint_atn address amount')
//   process.exit(1)
// }

const colors = require('colors')
const { encodeInputs, Contract, QtumRPC } = require('qtumjs')

const rpc = new QtumRPC('http://qtum:test@localhost:3889')

const abi = require('../abis/ATN.json').contracts['atn-contracts/ATN.sol']
const atn = new Contract(rpc, abi)
const mintABI = {
  name: "mint",
  type: "function",
  payable: false,
  inputs: [
    {
      name: "_guy",
      type: "address",
      indexed: false
    },
    {
      name: "_wad",
      type: "uint256",
      indexed: false
    }
  ],
  outputs: [],
  constant: false,
  anonymous: false
}


async function mintAtn(address, amount) {
  const from = abi.sender

  let b = await atn.call('balanceOf', [address])
  console.log(colors.green('=====>Balance before mint:'))
  console.log(b.outputs[0].toNumber())
  console.log()

  const calldata = encodeInputs(mintABI, [address, amount])
  const sent = await atn.rpc.sendToContract({
    datahex: calldata,
    address: atn.address,
    senderAddress: from
  })
  const txid = sent.txid
  const txinfo = await atn.rpc.getTransaction({txid})
  const sendTx = {
    ...txinfo,
    method: 'mint',
    confirm: (n, handler) => atn.confirm(sendTx, n, handler)
  }

  console.log(colors.green('=====>Sent tx:'))
  console.log(JSON.stringify({
    txid: sendTx.txid,
    method: sendTx.method,
    fee: sendTx.fee,
    confirmations: sendTx.confirmations
  }, null, 2))
  console.log()

  console.log(colors.green('=====>Waiting for transaction confirmation...'))
  console.log()
  await sendTx.confirm(1)

  b = await atn.call('balanceOf', [address])
  console.log(colors.green('=====>Balance after mint:'))
  console.log(b.outputs[0].toNumber())
}

module.exports = async (addr, n) => {
  const alloc = require('./allocQtum')
  await alloc(atn.info.sender, 0.01)
  await mintAtn(addr, n)
}
// module.exports(...args)
