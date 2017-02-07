'use strict'

const localServer = require('./lib/local-server')

const express = require('express')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3007

const app = express()

app.use(bodyParser.json({
  limit: '1kb'
}))

app.get('/keys', (req, res, next) => {
  localServer.broadcastCommand({
    command: 'list_keys'
  })[0]
  .then(answer => { res.status(200); res.send(answer.keys.sort()) })
  .catch(err => next(JSON.stringify(err)))
})
app.post('/keys/:key', (req, res, next) => {
  let command = req.body
  command.key = req.params.key
  localServer.broadcastCommand(command)[0]
  .then(answer => { res.status(200); res.end() })
  .catch(err => next(JSON.stringify(err)))
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
