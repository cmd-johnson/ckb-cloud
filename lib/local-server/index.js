'use strict'

const { CommandHandler } = require('../command-handler')
const { LocalInterface } = require('./local-interface')

const Promise = require('bluebird')

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

  getKey (clientId, key) {
    return this.localInterface.sendCommand(clientId, {
      command: 'get_key',
      key
    })
  }

  /* Key Effects */

  listKeyEffects (clientId, key) {
    return this.localInterface.sendCommand(clientId, {
      command: 'list_key_effects',
      key
    })
  }

  addKeyEffect (clientId, key, body) {
    if (body.effect === 'color') {
      return this.localInterface.sendCommand(clientId, {
        command: 'set_key_color',
        key,
        color: body.color
      })
    } else if (body.effect === 'gradient') {
      return this.localInterface.sendCommand(clientId, {
        command: 'set_key_gradient',
        key,
        duration: body.duration,
        loop_count: body.loop_count,
        color_stops: body.color_stops
      })
    } else {
      return Promise.reject('Unknown command')
    }
  }

  clearAllKeyEffects (clientId, key) {
    return this.localInterface.sendCommand(clientId, {
      command: 'clear_key',
      key
    })
  }

  getKeyEffect (clientId, key, effectId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'get_key_effect',
      key,
      effect_id: effectId
    })
  }

  clearKeyEffect (clientId, key, effectId) {
    return this.localInterface.sendCommand(clientId, {
      command: 'clear_key',
      key
    })
  }
}

module.exports = {
  LocalServer
}
