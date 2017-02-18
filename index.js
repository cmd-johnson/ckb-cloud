'use strict'

const { LocalServer } = require('./lib/local-server')
const { RESTServer } = require('./lib/rest-server')

const localServer = new LocalServer()
const restServer = new RESTServer()

const LOCAL_SOCKET = '/tmp/ckb-cloud'
const PORT = process.env.PORT || 3007

localServer.connect(LOCAL_SOCKET)
.then(status => {
  console.log(`Local server ${status} at socket ${LOCAL_SOCKET}`)
  return restServer.connect(PORT, localServer)
})
.then(port => {
  console.log(`REST-server listening on port ${port}`)
})
.catch(console.error)

/*
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
*/
