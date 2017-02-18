'use strict'

const Promise = require('bluebird')
const uuid = require('uuid')

const EventEmitter = require('events')
const readline = require('readline')

class Client extends EventEmitter {
  constructor () {
    super()

    this.clientId = ''
    this.pendingRequests = { }
  }

  connect (socket) {
    this.socket = socket
    this.connection = readline.createInterface({ input: socket })

    return this.waitForIdentification(this.connection)
    .then(clientId => {
      this.clientId = clientId
      this.connection.on('line', line => this.handleClientResponse(line))
      this.emit('connected', clientId)
      return clientId
    })
    .catch(err => {
      this.emit('error', err)
      return err
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      if (this.connection) this.connection.close()
      if (this.socket) this.socket.close()
      if (this.clientId) {
        this.emit('disconnected', this.clientId)
        this.clientId = ''
      }
      resolve()
    })
  }

  waitForIdentification (connection) {
    return new Promise((resolve, reject) => {
      // React for the client's response to the identify command.
      // Since the client only sends data when requested to do so, the
      // first line received must contain all the information we need.
      connection.once('line', line => {
        let answer
        try {
          answer = JSON.parse(line)
        } catch (err) { return reject(err) }

        if (!answer.success) {
          return reject('Request was unsuccessful', answer)
        }
        if (!answer.client_id) {
          return reject('Answer is missing a client_id', answer)
        }

        resolve(answer.client_id)
      })

      // Request the client to identify themselves.
      this.socket.write(`${JSON.stringify({
        id: uuid(),
        command: 'identify'
      })}\n`)
    })
  }

  handleClientResponse (response) {
    let answer
    try {
      answer = JSON.parse(response)
    } catch (err) {
      return this.emit('error', 'Answer contained invalid JSON: ' +
        JSON.stringify(err))
    }

    if (!answer.id) {
      return this.emit('error', 'Answer is missing a request id: ' +
        JSON.stringify(answer))
    }
    if (!this.pendingRequests[answer.id]) {
      return this.emit('error', 'Answer contained an unknown request id: ' +
        JSON.stringify(answer))
    }

    if (answer.success) {
      this.pendingRequests[answer.id].success(answer)
    } else {
      this.pendingRequests[answer.id].failure(answer)
    }
    this.pendingRequests[answer.id] = undefined
  }

  sendCommand (command) {
    if (!(this.socket && this.connection && this.clientId)) {
      return Promise.reject('Client not ready')
    }

    return new Promise((resolve, reject) => {
      command.id = uuid()

      const clearRequest = () => {
        this.pendingRequests[command.id] = undefined
      }

      this.pendingRequests[command.id] = {
        success: (message) => { clearRequest(); resolve(message) },
        failure: (message) => { clearRequest(); reject(message) }
      }

      this.socket.write(`${JSON.stringify(command)}\n`)
    })
  }
}

module.exports = {
  Client
}
