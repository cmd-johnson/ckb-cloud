'use strict'

const Promise = require('bluebird')

const readline = require('readline')
const uuid = require('uuid')

let connectedClients = { }
let pendingRequests = { }

function onClientConnected (socket) {
  console.log('Client connected')
  const connection = readline.createInterface({ input: socket })

  // Wait for an answer to the identify-command
  connection.once('line', (line) => {
    try {
      const answer = JSON.parse(line)
      if (!answer.success) {
        return console.error(`Error requesting client_id: ${answer.error}: ` +
          `${answer.message}`)
      }
      if (!answer.client_id) {
        return console.error(`Error requesting client_id: Answer doesn't ` +
          `contain a client_id field: ${line}`)
      }

      console.log(`Client identified as ${answer.client_id}`)

      if (connectedClients[answer.client_id]) {
        console.log(`Client with id ${answer.client_id} already exists, ` +
          `closing previous connection.`)
        connectedClients[answer.client_id].end()
      }

      connectedClients[answer.client_id] = socket
      connection.on('line', handleResponse)
    } catch (e) {
      console.error(`Error requesting client_id: ${e}`)
    }
  })
  identify(socket)
}

function handleResponse (response) {
  try {
    const answer = JSON.parse(response)
    if (!answer.id) {
      return console.error(`Client response is missing a id: ${response}`)
    }
    if (!pendingRequests[answer.id]) {
      return console.error(`Received client answer with unknown id: ${response}`)
    }
    if (answer.success) {
      pendingRequests[answer.id].success(answer)
    } else {
      pendingRequests[answer.id].failure(answer)
    }
    pendingRequests[answer.id] = undefined
  } catch (e) {
    console.error(`Error parsing client response: ${response}`)
  }
}

function broadcastCommand (command) {
  return Object.keys(connectedClients).map(key => {
    return sendCommand(connectedClients[key], command)
  })
}

function sendCommand (socket, command) {
  return new Promise((resolve, reject) => {
    command.id = uuid()
    socket.write(`${JSON.stringify(command)}\n`)

    function clearRequest () {
      pendingRequests[command.id] = undefined
    }

    pendingRequests[command.id] = {
      success: (val) => { clearRequest(); resolve(val) },
      failure: (err) => { clearRequest(); reject(err) }
    }
  })
}

function identify (socket) {
  return sendCommand(socket, { command: 'identify' })
}

module.exports = {
  onClientConnected,
  broadcastCommand
}
