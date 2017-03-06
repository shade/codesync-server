const WebSocket = require('ws')
const Hapi = require('hapi')
const Server = new Hapi.Server()
const Socket = require('./routes/socket')

// Create a server and set up the connection.
Server.connection({
  host: 'localhost',
  port: 5000
})

// Declare some globals.
global.SocketServer = new WebSocket.Server({ port: 5001 })
global.DB = require('monk')('localhost:27017/codesync')

// Declare constants.
const ROUTES = [ './routes/user' ]


// Go through all the routes packages, and set up the hapi endpoints.
ROUTES.forEach((uri) => {
  var thing = require(uri)

  thing.forEach((route) => {
    Server.route(route)
  })
})


// Start the socket server.
Socket.start()

// Start the server.
Server.start((err) => {
  if (err) {
    throw err
  }

  console.log('CodeSync API Running at: ', Server.info.uri);
})
