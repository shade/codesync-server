
// Object to hold all the events.
Events = {}


Events.getList = (data) => {
  
}







function main () {
  SocketServer.on('connection', (socket) => {
    for (var event in Events) {
      socket.on(event, Events[event].bind(socket))
    }
  })
}


module.exports = {
  start: main
}
