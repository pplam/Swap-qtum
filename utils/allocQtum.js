const Rpc = require('qtumd-rpc')

const config = {
  protocol: 'http',
  user: 'qtum',
  pass: 'test',
  host: 'localhost',
  port: '3889'
}

module.exports = function allocQtum(address, amount) {
  const rpc = new Rpc(config)
  return new Promise((resolve, reject) => {
    rpc.sendToAddress(address, amount, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

