'use strict'

const { CommandHandler } = require('../command-handler')
const { LocalInterface } = require('./local-interface')

const Promise = require('bluebird')

// TODO: Input validation: Make sure the correct datatypes are passed and don't
// pass everything to the local client without checking it.

class LocalServer extends CommandHandler {
  constructor () {
    super()
    this.localInterface = new LocalInterface()
  }

  connect (socketPath) {
    return this.localInterface.connect(socketPath)
  }

  disconnect () {
    return this.localInterface.disconnect()
  }

  /* Clients */

  listClients () {
    return this.localInterface.getConnectedClients()
  }

  getClient (clientId) {
    return this.localInterface.getClient(clientId)
  }

  /* Keys */

  listKeys (clientId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'list_keys'
    })
  }

  getKey (clientId, keyId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'get_key',
      key_id: keyId
    })
  }

  /* Key Effects */

  listKeyEffects (clientId, keyId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'list_key_effects',
      key_id: keyId
    })
  }

  getKeyEffect (clientId, keyId, effectId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'get_key_effect',
      key_id: keyId,
      effect_id: effectId
    })
  }

  addKeyEffect (clientId, keyId, body) {
    console.dir(body)
    let command = {
      command: 'add_key_effect',
      key_id: keyId
    }
    if (body.effect === 'color') {
      command.effect = 'color'
      command.color = body.color // TODO: better colour parsing
      return this.localInterface.sendCommand(clientId, command)
    } else if (body.effect === 'gradient') {
      command.effect = 'gradient'
      command.duration = body.duration // TODO: assert this is a number
      command.loop_count = body.loop_count // TODO: assert this is an integer
      command.color_stops = body.color_stops // TODO: better colour parsing and input validation

      return this.localInterface.sendCommand(clientId, command)
    } else {
      return Promise.reject('Unknown command')
    }
  }

  clearAllKeyEffects (clientId, keyId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'clear_all_key_effects',
      key_id: keyId
    })
  }

  clearKeyEffect (clientId, keyId, effectId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'clear_key_effect',
      key_id: keyId,
      effect_id: effectId
    })
  }
}

module.exports = {
  LocalServer
}
