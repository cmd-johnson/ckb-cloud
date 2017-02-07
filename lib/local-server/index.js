'use strict'

const commands = require('./commands')
const fs = require('fs')
const net = require('net')

const SOCKET = '/tmp/ckb-cloud'

const server = net.createServer(commands.onClientConnected)

// http://stackoverflow.com/a/16502680/7483565
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    const clientSocket = new net.Socket()
    clientSocket.on('error', err => {
      if (err.code === 'ECONNREFUSED') {
        fs.unlinkSync(SOCKET)
        server.listen(SOCKET, () => {
          console.log('Server recovered')
        })
      }
    })
    clientSocket.connect({ path: SOCKET }, () => {
      console.log('Server already running, giving up')
      process.exit()
    })
  }
})

server.listen(SOCKET, () => {
  console.log('Server started')
})

module.exports = commands
