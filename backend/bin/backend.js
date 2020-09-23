#!/usr/bin/env node
/**
 * Module dependencies.
 */

var app = require('../app')
var debug = require('debug')('myapp:server')
var http = require('http')

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

// Create HTTP server.
var server = http.createServer(app)

/*
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// socket init
const socketIo = require("socket.io")
const io = socketIo(server)

const ClientManager = require('../sockets/clientManager')
const RoomManager = require('../sockets/roomManager')
const makeHandlers = require('../sockets/handler')
const clientManager = ClientManager()
const roomManager = RoomManager()

io.on("connection", client => {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleComment,
    handleGetRooms,
    handleGetAvailableClients,
    handleDisconnect,
  } = makeHandlers(client, clientManager, roomManager)

  console.log("New client connected... " + client.id)

  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('comment', handleComment)

  client.on('rooms', handleGetRooms)

  client.on('availableClients', handleGetAvailableClients)

  client.on('disconnect', () => {
    console.log('Client disconnect... ', client.id)
    handleDisconnect()
  })

  client.on('error', (err) => {
    console.log('Received error from client:', client.id)
    console.log(err)
  })
})


// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
