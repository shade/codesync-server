const WebSocket = require('ws')

// Declare some constants.
const TERMINATE_INTERVAL_LENGTH = 60000
const WEBSOCKET_DELIMETER = ':|:'


// Object to hold all the events.
Events = {}



Events.auth = (data, socket) => {
  console.log('Auth!')
}

Events.list = (data, socket) => {

}




/** Starts the socket server */
function main () {

  // Declare the server, globally.
  global.SocketServer = new WebSocket.Server({ 
    port: 5001,
    host: 'localhost'
  })

  // Set the server events.
  SocketServer.on('connection', socket => {

    // Do stuff on the messages.
    socket.on('message', (data, flags) => {
      
      // These are the conditions to kill it.
      if (flags.binary || (data.indexOf(WEBSOCKET_DELIMETER) == -1)) return
        
      // Grab the necessary event data and stuff.
      var msgArr = data.split(WEBSOCKET_DELIMETER)
      var event = msgArr[0]

      // Execute the Events.
      Events[event] && Events[event](msgArr[1], socket)
    })

  })


  global.terminateInterval = setInterval(() => {

  }, TERMINATE_INTERVAL_LENGTH)

}


module.exports = {
  start: main
}
