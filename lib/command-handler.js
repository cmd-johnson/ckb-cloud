'use strict'

class CommandHandler {
  listClients () { }
  getClient (clientId) { }

  listKeys (clientId) { }
  getKey (clientId, key) { }

  listKeyEffects (clientId, key) { }
  addKeyEffect (clientId, key, body) { }
  clearAllKeyEffects (clientId, key) { }
  getKeyEffect (clientId, key, effectId) { }
  clearKeyEffect (clientId, key, effectId) { }
}

module.exports = {
  CommandHandler
}
