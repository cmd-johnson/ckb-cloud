'use strict'

module.exports = function init (commandHandler) {
  return {
    listKeyEffects,
    addKeyEffect,
    clearKeyEffect,
    getKeyEffect,
    clearAllKeyEffects
  }

  function listKeyEffects (req, res, next) {
    commandHandler.listKeyEffects(req.params.client_id, req.params.key_id)
    .then(effects => {
      res.status(200).json(effects)
    })
    .catch(err => next(JSON.stringify(err)))
  }

  function addKeyEffect (req, res, next) {
    commandHandler.addKeyEffect(req.params.client_id, req.params.key_id, req.body)
    .then(effect => {
      res.status(200).json(effect)
    })
    .catch(err => next(JSON.stringify(err)))
  }

  function clearKeyEffect (req, res, next) {
    commandHandler.clearKeyEffect(req.params.client_id, req.params.key_id, req.params.effect_id)
    .then(() => {
      res.status(200).end()
    })
    .catch(err => next(JSON.stringify(err)))
  }

  function getKeyEffect (req, res, next) {
    commandHandler.getKeyEffect(req.params.client_id, req.params.key_id, req.params.effect_id)
    .then(effect => {
      res.status(200).json(effect)
    })
    .catch(err => next(JSON.stringify(err)))
  }

  function clearAllKeyEffects (req, res, next) {
    commandHandler.clearAllKeyEffects(req.params.client_id, req.params.key_id)
    .then(() => {
      res.status(200).end()
    })
    .catch(err => next(JSON.stringify(err)))
  }
}
