const Hapi = require('hapi');
const Server = new Hapi.Server()

// Create a server and set up the connection.
Server.connection({
  host: 'localhost',
  port: 5000
})

var Routes = [
  './routes/user',
]


// Go through all the routes packages, and set up the hapi endpoints.
Routes.forEach((uri) => {
  var thing = require(uri)

  thing.forEach((route) => {
    Server.route(route)
  })
})


// Start the server.
Server.start((err) => {
  if (err) {
    throw err
  }

  console.log('CodeSync API Running at: ', Server.info.uri);
})