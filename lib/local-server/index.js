'use strict'

const { CommandHandler } = require('../command-handler')
const { LocalInterface } = require('./local-interface')

const _ = require('lodash')
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
    const { effect } = body

    let command

    switch (effect) {
      case 'color':
        command = {
          color: body.color
        }
        break
      case 'gradient':
        command = {
          duration: body.duration,
          loop_count: body.loop_count,
          color_stops: body.color_stops
        }
        break
      default:
        return Promise.reject('Unknown command')
    }
    command = _.assign(command, {
      command: 'add_key_effect',
      key_id: keyId,
      effect: effect
    })
    console.dir(command)
    return this.localInterface.sendCommand(clientId, command)
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
