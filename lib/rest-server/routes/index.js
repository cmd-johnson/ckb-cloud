'use strict'

const { Router } = require('express')

function init (commandHandler) {
  const clients = require('./clients')(commandHandler)
  const keys = require('./keys')(commandHandler)
  const keyEffects = require('./key-effects')(commandHandler)

  const router = new Router()
  router.use((req, res, next) => {
    next()
  })

  router.get('/', (req, res) => {
    res.status(200).json({
      version: require('../../../package.json').version
    })
  })

  const clientRouter = new Router({ mergeParams: true })
  clientRouter.get('/', clients.listClients)
  clientRouter.get('/:client_id/', clients.getClient)

  const keyRouter = new Router({ mergeParams: true })
  keyRouter.get('/', keys.listKeys)
  keyRouter.get('/:key_id/', keys.getKey)

  const keyEffectRouter = new Router({ mergeParams: true })
  keyEffectRouter.get('/', keyEffects.listKeyEffects)
  keyEffectRouter.post('/', keyEffects.addKeyEffect)
  keyEffectRouter.delete('/', keyEffects.clearAllKeyEffects)
  keyEffectRouter.get('/:effect_id/', keyEffects.getKeyEffect)
  keyEffectRouter.delete('/:effect_id/', keyEffects.clearKeyEffect)

  // Wire up routers
  keyRouter.use('/:key_id/effects/', keyEffectRouter)
  clientRouter.use('/:client_id/keys/', keyRouter)
  router.use('/clients/', clientRouter)

  return router
}

module.exports = init
