'use strict'

module.exports = function init (commandHandler) {
  return {
    listClients,
    getClient
  }

  function listClients (req, res, next) {
    commandHandler.listClients()
    .then(clients => {
      res.status(200).json(clients)
    })
    .catch(err => next(JSON.stringify(err)))
  }

  function getClient (req, res, next) {
    commandHandler.getClient(req.params.client_id)
    .then(client => {
      res.status(200).json(client)
    })
    .catch(err => next(JSON.stringify(err)))
  }
}
