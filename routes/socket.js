const Url = require('url')
const WebSocket = require('ws')
const Security = require('../utils/security')

// Declare some constants.
const TERMINATE_INTERVAL_LENGTH = 60000
const WEBSOCKET_DELIMETER = ':|:'

// The appropriate maps needed for aggregation.
global.Socket = {}

var SpaceMap = global.Socket.SpaceMap = {}
var UserMap = global.Socket.UserMap = {}

// The Events route, object.
var Events = {}

// HANDLE LIST EVENTS
Events.list = (data, socket) => {
  // Try parsing the JSON. Fail if otherwise.
  try {
    var json  = JSON.parse(data)
    var spaceName = json.space
  } catch (e) {
    logError(socket, 'INVALID JSON SENT!')
    return
  }

  // Tell the user there's a bad space name, if none is supplied.
  if (!spaceName) {
    logError(socket, 'BAD SPACE NAME!')
    return
  }

  // Check for the existence of the space in the map, otherwise, quit.
  var space = SpaceMap[spaceName]

  // Handle the space not existing.
  if (!space) {
    Models.Space.find({
      name: spaceName
    }, (err, response) => {

      // Check for error cases.
      if (err) {
        logError(socket, "DATABASE ERROR!")
        return
      }
      /*
      UNCOMMENT WHEN WE'RE READY.
      if (!response) {
        logError(socket, "SPACE DOESN'T EXIST!")
        return
      }
      */
      // Create the space.
      SpaceMap[spaceName] = {
        id: spaceName,
        activeUsers: {},
        data: response
      }
      
      // Add you to the active users.
      SpaceMap[spaceName].activeUsers[socket.id] = UserMap[socket.id]
      // Add the space to you.
      UserMap[socket.id].spaces.push(SpaceMap[spaceName])
      // Emit an empty list for consistency.
      emitData(socket, 'list', [])
    })

  // Handle when the space already exists.
  } else {
    // If you're part of the space, loudly exit.
    if (SpaceMap[spaceName].activeUsers[socket.id]) {
      logError(socket, "YOU'RE ALREADY PART OF THE SPACE")
      return
    }

    // Grab the current set of people.
    var _people = Object.keys(SpaceMap[spaceName].activeUsers)
    // Add you to the people.
    SpaceMap[spaceName].activeUsers[socket.id] = UserMap[socket.id]
    // Add the space to you.
    UserMap[socket.id].spaces.push(SpaceMap[spaceName])
    // Send you the list of people.
    emitData(socket, 'list', _people)
  }
}

















function logError (socket, msg) {
  socket.send('error' + WEBSOCKET_DELIMETER + msg)
}

function emitData  (socket, event, data) {
  socket.send(event + WEBSOCKET_DELIMETER + JSON.stringify(data))
}

// Kills the user from all the spaces. Notifies the people in the space that he's gone.
function killUser (socket) {
  var id = socket.id

  // Iterate through all the spaces, and remove you from active users.
  UserMap[id].spaces.forEach(space  => {
    // Get rid of you.
    delete space.activeUsers[id]
    // Go through the users and notify them.
    var users = space.activeUsers
    for (var used_id in users) {
      var user = users[used_id]
      // Notify the death to the user.
      emitData(user.socket, 'died', {
        user: user.id,
        space: space.id
      })
    }
  })
}



/** Starts the socket server */
function main () {

  // Declare the server, globally.
  global.SocketServer = new WebSocket.Server({ 
    port: 5001,
    host: 'localhost',
    verifyClient: (info) => {
      var urlObj = Url.parse(info.req.url, true)
      // Check if it's a valid token.
      return Security.validToken(urlObj.query.t)
    }
  })

  // Set the server events.
  SocketServer.on('connection', socket => {
    // Grab the username, from the previous the thing.
    var username = Url.parse(socket.upgradeReq.url, true).query.t.split('^_^')[0]

    // Add the socket to the users list.
    UserMap[username] = {
      active: true,
      socket: socket,
      spaces: []
    }
    socket.id = username
    
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

    socket.on('close', () => {
      killUser(socket)
    })

  })
}


module.exports = {
  start: main
}


