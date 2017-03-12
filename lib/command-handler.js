'use strict'

const { CkbError } = require('./util/error')

const Promise = require('bluebird')

class CommandHandler {
  listClients () {
    return Promise.reject(new CkbError('notOverridden'))
  }
  getClient (clientId) {
    return Promise.reject(new CkbError('notOverridden'))
  }

  listKeys (clientId) {
    return Promise.reject(new CkbError('notOverridden'))
  }
  getKey (clientId, key) {
    return Promise.reject(new CkbError('notOverridden'))
  }

  listKeyEffects (clientId, key) {
    return Promise.reject(new CkbError('notOverridden'))
  }
  addKeyEffect (clientId, key, body) {
    return Promise.reject(new CkbError('notOverridden'))
  }
  clearAllKeyEffects (clientId, key) {
    return Promise.reject(new CkbError('notOverridden'))
  }
  getKeyEffect (clientId, key, effectId) {
    return Promise.reject(new CkbError('notOverridden'))
  }
  clearKeyEffect (clientId, key, effectId) {
    return Promise.reject(new CkbError('notOverridden'))
  }
}

module.exports = {
  CommandHandler
}
