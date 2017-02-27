'use strict'

const { colorToRGBA } = require('../../util/colors')

const _ = require('lodash')

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
    const { effect } = req.body
    let validateEffect
    switch (effect) {
      case 'color':
        validateEffect = validateAddColorRequest(req.body)
        break
      case 'gradient':
        validateEffect = validateAddGradientRequest(req.body)
        break
      default:
        validateEffect = Promise.reject(`Invalid effect '${effect}'`)
    }

    const { client_id: clientId, key_id: keyId } = req.params

    validateEffect
    .catch(next)
    .then(effect => commandHandler.addKeyEffect(clientId, keyId, _.assign(effect, { effect: req.body.effect })))
    .then(effect => res.status(201).json(effect))
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

function validateAddGradientRequest (body) {
  const {
    duration,
    loop_count: loopCount,
    color_stops: colorStops
  } = body
  if (typeof duration !== 'number' || duration <= 0) {
    return Promise.reject(`Invalid duration '${duration}'`)
  } else if (typeof loopCount !== 'number' || loopCount !== (loopCount | 0) || loopCount < 0) {
    return Promise.reject(`Invalid loopCount '${loopCount}'`)
  } else if (!Array.isArray(colorStops)) {
    return Promise.reject(`Invalid color_stops '${colorStops}'`)
  }

  let error
  let lastPos = -Infinity
  const stops = colorStops.reduce((acc, stop) => {
    if (error) { return }
    const { position } = stop
    if (typeof position !== 'number' || !Number.isFinite(position)) {
      error = `Invalid position '${position}'`
      return
    } else if (position < lastPos) {
      error = `Stop position '${position}' is less than '${lastPos}'`
      return
    }
    lastPos = position

    const color = colorToRGBA(stop.color)
    if (!color) {
      error = `Invalid color '${stop.color}'`
      return
    }
    return acc.concat([{ position, color }])
  }, [])
  if (error) {
    return Promise.reject(error)
  }
  return Promise.resolve({
    duration,
    loop_count: loopCount,
    color_stops: stops
  })
}

function validateAddColorRequest (body) {
  const color = colorToRGBA(body.color)
  if (!color) return Promise.reject(`Invalid color '${body.color}'.`)
  return Promise.resolve({ color })
}
