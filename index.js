// The packages required here.
const Inert = require('inert')
const Vision = require('vision')
const Jade = require('jade')
const Hapi = require('hapi')
const Mongoose = require('mongoose')

// Start the server.
const Server = new Hapi.Server()
const Socket = require('./routes/socket')

// Create a server and set up the connection.
Server.connection({
  host: 'localhost',
  port: 5000
})

// Declare constants.
const ROUTES = [ 
  './routes/api/auth',
  './routes/api/data',
  './routes/api/repo',
]


// Start the socket server.
Socket.start()

// Go through all the routes packages, and set up the hapi endpoints.
ROUTES.forEach((uri) => {
  var thing = require(uri)

  thing.forEach((route) => {
    Server.route(route)
  })
})


// Add the template stuff.
Server.register([Vision,Inert], (err) => {
 
    if (err) throw err

    // Set the Server views.
    Server.views({
        engines: { jade: Jade },
        path: __dirname + '/views',
        isCached: false,
        compileOptions: {
            pretty: true,
        }
    })

    require('./routes/pages').forEach((route) => {
      Server.route(route)
    })
});


// Connect to mongoDB and then start the server.
Mongoose.connect('localhost:27017/codesync');

global.db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // Create a global models.
  global.Models = require('./utils/models')

  // Start the server.
  Server.start((err) => {
    if (err) {
      throw err
    }

    console.log('CodeSync Server Running at: ', Server.info.uri);
  })
  // we're connected!
});
