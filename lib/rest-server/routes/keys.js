'use strict'

module.exports = function init (commandHandler) {
  return {
    listKeys,
    getKey
  }

  function listKeys (req, res, next) {
    commandHandler.listKeys(req.params.client_id)
    .then(keys => {
      res.status(200).json(keys)
    })
    .catch(next)
  }

  function getKey (req, res, next) {
    commandHandler.getKey(req.params.client_id, req.params.key_id)
    .then(key => {
      res.status(200).json(key)
    })
    .catch(next)
  }
}
