'use strict'

const { Client } = require('./client')

const Promise = require('bluebird')

const net = require('net')
const fs = require('fs')

class LocalInterface {
  constructor () {
    this.connectedClients = { }
  }

  connect (socketPath) {
    this.socketPath = socketPath

    return new Promise((resolve, reject) => {
      this.server = net.createServer(socket => this.onClientConnected(socket))

      // If the chosen socket already is in use, check if a server is already
      // running on that port. If not, close the socket and reopen it, otherwise
      // fail gracefully. (ref. http://stackoverflow.com/a/16502680/7483565)
      this.server.on('error', err => {
        if (err.code !== 'EADDRINUSE') return reject(err)

        const clientSocket = new net.Socket()
        clientSocket.on('error', err => {
          if (err.code !== 'ECONNREFUSED') return reject(err)

          fs.unlinkSync(this.socketPath)
          this.server.listen(this.socketPath, () => {
            resolve('recovered')
          })
        })
        clientSocket.connect({ path: this.socketPath }, () => {
          reject(new Error('Server already running'))
        })
      })

      this.server.listen(this.socketPath, () => {
        resolve('started')
      })
    })
  }

  disconnect () {
    const disconnectHandlers = Object.keys(this.connectedClients)
    .map(clientId => this.connectedClients[clientId].disconnect())

    // Wait for all client connections to end, then close the server socket
    // itself.
    return Promise.all(disconnectHandlers)
    .then(() => new Promise((resolve, reject) => {
      this.server.close(err => err ? reject(err) : resolve())
    }))
  }

  onClientConnected (socket) {
    const client = new Client()

    client.on('disconnected', clientId => {
      this.connectedClients[clientId] = undefined
    })

    client.connect(socket)
    .then(clientId => {
      this.connectedClients[clientId] = client
      console.log(`Client connected: ${clientId}`)
    })
  }

  getConnectedClients () {
    return Promise.resolve(Object.keys(this.connectedClients))
  }

  getClient (clientId) {
    if (this.connectedClients[clientId]) {
      return Promise.resolve({ client_id: clientId })
    } else {
      return Promise.reject({ message: 'invalid client_id' })
    }
  }

  sendCommand (clientId, command) {
    if (!this.connectedClients[clientId]) {
      console.log(`Clients available: ${JSON.stringify(Object.keys(this.connectedClients))}, requested: ${clientId}`)
      return Promise.reject('Invalid client_id')
    }
    return this.connectedClients[clientId].sendCommand(command)
  }
}

module.exports = {
  LocalInterface
}
