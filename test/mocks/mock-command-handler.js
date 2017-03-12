'use strict'

const { CkbError } = require('../../lib/util/error')
const { CommandHandler } = require('../../lib/command-handler')

const Promise = require('bluebird')
const uuid = require('uuid')

class MockCommandHandler extends CommandHandler {
  constructor () {
    super()
    this.clients = []
  }

  listClients () {
    return Promise.resolve(this.clients.map(({ id }) => ({ id })))
  }
  getClient (clientID) {
    return this._findClient(clientID)
      .then(({ id }) => ({ id }))
  }

  listKeys (clientID) {
    return this._findClient(clientID)
      .then(({ keys }) => (keys || []).map(({ id, position }) => ({ id, position })))
  }
  getKey (clientID, keyID) {
    return this._findKey(clientID, keyID)
      .then(key => {
        return key
      })
      .then(({ id, position }) => { return { id, position } })
  }

  listKeyEffects (clientID, keyID) {
    return this._findKey(clientID, keyID)
      .then(({ effects }) => (effects || []))
  }
  addKeyEffect (clientID, keyID, body) {
    return this._findKey(clientID, keyID)
      .then(key => {
        body.id = uuid()
        key.effects = (key.effects || []).concat([body])
      })
  }
  clearAllKeyEffects (clientID, keyID) {
    return this._findKey(clientID, keyID)
      .then(key => {
        key.effects = []
      })
  }
  getKeyEffect (clientID, keyID, effectID) {
    return this._findEffect(clientID, keyID, effectID)
  }
  clearKeyEffect (clientID, keyID, effectID) {
    return this._findKey(clientID, keyID)
      .then(key => new Promise((resolve, reject) => {
        const index = (key.effects || []).findIndex(({ id }) => id === effectID)
        if (index >= 0) {
          key.effects.splice(index, 1)
          resolve()
        } else {
          reject(new CkbError('invalidEffectID', null, { effect_id: effectID }))
        }
      }))
  }

  _findClient (clientID) {
    return new Promise((resolve, reject) => {
      const client = this.clients.find(client => client.id === clientID)
      client ? resolve(client) : reject(new CkbError('invalidClientID', null, { client_id: clientID }))
    })
  }
  _findKey (clientID, keyID) {
    return this._findClient(clientID)
      .then(client => new Promise((resolve, reject) => {
        const key = (client.keys || []).find(key => key.id === keyID)
        key ? resolve(key) : reject(new CkbError('invalidKeyID', null, { key_id: keyID }))
      }))
  }
  _findEffect (clientID, keyID, effectID) {
    return this._findKey(clientID, keyID)
      .then(key => new Promise((resolve, reject) => {
        const effect = (key.effects || []).find(effect => effect.id === effectID)
        effect ? resolve(effect) : reject(new CkbError('invalidEffectID', null, { effect_id: effectID }))
      }))
  }
}

module.exports = {
  MockCommandHandler
}
