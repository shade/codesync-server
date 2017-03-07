const Url = require('url')
const WebSocket = require('ws')
const Security = require('../utils/security')

// Declare some constants.
const TERMINATE_INTERVAL_LENGTH = 60000
const WEBSOCKET_DELIMETER = ':|:'

global.SocketServer = null



// Object to hold all the events.
var Users = {}
var Events = {}


Events.list = (data, socket) => {

}





/**
 * Accepts some data and sends it to the person.
 * With the current socket data.
 * 
 * @param  {JSON} data {
 *                       to: 'USER_ID',
 *                       data: 'String data'
 *                     }
 *
 * @return {JSON} data {
 *                       from: 'USER_ID',
 *                       data: 'String data'
 *                     }
 */
Events.send = (data, socket) => {

  // Make sure this is valid JSON, or fail.
  try {
    var {to, data} = JSON.parse(data)
  } catch (e) {
    logError(socket, 'bad JSON')
    return
  }

  // Find the reciever or fail.
  var toSocket = Users[to]
  if (!toSocket) {
    logError(socket, 'bad User')
    return
  }

  // Send to the socket, with data and sender.
  toSocket.send({
    from: socket.id,
    data: data
  })
}















/** Starts the socket server */
function main () {

  // Declare the server, globally.
  global.SocketServer = new WebSocket.Server({ 
    port: 5001,
    host: 'localhost',
    verifyClient: (info) => {
      console.log(Security.tokenify(info.req.url))
      return true
    }
  })

  // Set the server events.
  SocketServer.on('connection', socket => {
    // Add the socket to the users list.
    Users[] = socket

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
