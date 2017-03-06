

const WEBSOCKET_DELIMETER = ':|:'




// Object to hold all the events.
Events = {}



Events.auth = (data, socket) => {
  
}

Events.list = (data, socket) => {
  
}




/** Starts the socket server */
function main () {

  // Declare the server, globally.
  global.SocketServer = new WebSocket.Server({ port: 5001 })

  // Set the server events.
  SocketServer.on('connection', socket => {

    // Do stuff on the messages.
    socket.on('message', (data, flags) => {
      
      // These are the conditions to kill it.
      if (flags.binary || data.indexOf(WEBSOCKET_DELIMETER) != 1) return

      // Grab the necessary event data and stuff.
      var msgArr = data.split(WEBSOCKET_DELIMETER)
      var event = msgArr[0]

      // Execute the Events.
      Events[event] && Events[event](msgArr[1], socket)
    })

  })
}


module.exports = {
  start: main
}
