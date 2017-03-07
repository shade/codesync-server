const Redis = require('redis')
const Url = require('url')
const WebSocket = require('ws')
const Security = require('../utils/security')

// Declare some constants.
const TERMINATE_INTERVAL_LENGTH = 60000
const WEBSOCKET_DELIMETER = ':|:'

global.SocketServer = null
global.RedisClient = Redis.createClient()


// Object to hold all the events.
var Users = {}
var Events = {}


/**
 * Accepts a repo ID and sends back a list of people in the repo, if legit repo
 * @param  {JSON} data   {
 *                         repo: 'REPO_ID'
 *                       }
 *
 * @return {Array<USER_ID>} data[]
 */
Events.list = (data, socket) => {

  // Make sure this is valid JSON, or fail.
  try {
    var {repo} = JSON.parse(data)
  } catch (e) {
    logError(socket, 'bad JSON')
    return
  }
  var you_id = socket.id

  // Grab the userlist.
  RedisClient.lrange(`${repo}list`,0,-1, (err, result) => {
      if (err) logError(socket, 'redis DB error..')


      // Make sure you're already not part of the user list, or die.
      for (var i = 0, ii = result.length; i < ii; i++) {
        if (you_id == result[i]) {
          logError(socket, 'You\'re already on list')
          return
        }
      }
      // Send the user list to you.
      emitData(socket,'list',result)
      // Add you to the userlist.
      RedisClient.rpush(`${repo}list`,`${you_id}`, () => ())

    }
  }) 

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
  emitData(toSocket, 'data', JSON.stringify({
    from: socket.id,
    data: data
  }))
}





function legoError (socket, msg) {
  socket.send('error'+WEBSOCKET_DELIMETER+msg)
}
function emitData  (socket, event, data) {
  socket.send(event + JSON.stringify(data))
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
    Users[Security.tokenify(socket.upgradeReq.url)] = socket
    socket.id = Security.tokenify(socket.upgradeReq.url)
    
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
}


module.exports = {
  start: main
}
