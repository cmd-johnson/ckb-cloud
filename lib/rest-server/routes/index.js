'use strict'

const { Router } = require('express')

function init (commandHandler) {
  const root = require('./root')
  const clients = require('./clients')(commandHandler)
  const keys = require('./keys')(commandHandler)
  const keyEffects = require('./key-effects')(commandHandler)

  const router = new Router()
  .get('/', root.getRoot)
  .use('/clients', new Router()
    .get('/', clients.listClients)
    .use('/:client_id', new Router({ mergeParams: true })
      .get('/', clients.getClient)
      .use('/keys', new Router({ mergeParams: true })
        .get('/', keys.listKeys)
        .use('/:key_id', new Router({ mergeParams: true })
          .get('/', keys.getKey)
          .use('/effects', new Router({ mergeParams: true })
            .get('/', keyEffects.listKeyEffects)
            .post('/', keyEffects.addKeyEffect)
            .delete('/', keyEffects.clearAllKeyEffects)
            .use('/:effect_id', new Router({ mergeParams: true })
              .get('/', keyEffects.getKeyEffect)
              .delete('/', keyEffects.clearKeyEffect)
            )
          )
        )
      )
    )
  )

  return router
}

module.exports = init
