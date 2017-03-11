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
})
.then(() => restServer.init(localServer))
.then(() => restServer.listen(PORT))
.then(port => {
  console.log(`REST-server listening on port ${port}`)
})
.catch(console.error)
