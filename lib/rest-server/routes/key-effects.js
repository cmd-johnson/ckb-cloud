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
    .then(effect => commandHandler.addKeyEffect(clientId, keyId, _.assign(effect, { effect: req.body.effect })))
    .then(() => res.status(204).end())
    .catch(next)
  }

  function clearKeyEffect (req, res, next) {
    commandHandler.clearKeyEffect(req.params.client_id, req.params.key_id, req.params.effect_id)
    .then(() => {
      res.status(204).end()
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
      res.status(204).end()
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

  if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
    return Promise.reject(`Invalid duration '${duration}'`)
  } else if (loopCount !== undefined && (typeof loopCount !== 'number' || !Number.isInteger(loopCount) || loopCount < 0)) {
    return Promise.reject(`Invalid loopCount '${loopCount}'`)
  } else if (!Array.isArray(colorStops)) {
    return Promise.reject(`Invalid color_stops '${colorStops}'`)
  }

  let errors = []
  let lastPos = -Infinity
  const stops = colorStops.map((stop, index) => {
    const { position, color } = stop

    if (typeof position !== 'number' || !Number.isFinite(position)) {
      return errors.push(`Invalid position '${position}' at color_stops[${index}]`)
    } else if (position < lastPos) {
      return errors.push(`Stop position '${position}' is less than '${lastPos}' at color_stops[${index}]`)
    }
    lastPos = position

    const rgbaColor = colorToRGBA(color)
    if (!rgbaColor) {
      return errors.push(`Invalid color '${stop.color}' at color_stops[${index}]`)
    }
    return { position, color: rgbaColor }
  })

  if (errors.length > 0) {
    return Promise.reject(errors)
  }
  return Promise.resolve({
    duration: duration === undefined ? 1.0 : duration,
    loop_count: loopCount === undefined ? 1 : loopCount,
    color_stops: stops
  })
}

function validateAddColorRequest (body) {
  const color = colorToRGBA(body.color)
  if (!color) return Promise.reject(`Invalid color '${body.color}'.`)
  return Promise.resolve({ effect: 'color', color })
}
