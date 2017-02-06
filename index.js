'use strict'

const net = require('net')
const readline = require('readline')

const server = net.createServer(socket => {
  console.log('! client connected')
  const connection = readline.createInterface({
    input: socket
  })
  const cli = readline.createInterface({
    input: process.stdin
  })
  connection.on('line', line => {
    console.log(`> ${line}`)
  })
  cli.on('line', line => {
    socket.write(`${line}\n`)
  })
})
server.listen(3007, 'localhost')
