import io from 'socket.io-client'
import urlUtils from 'utils/UrlUtils'

const socket = io(urlUtils.host)

socket.on('error', function (err) {
  console.log('received socket error:')
  console.log(err)
})

function registerHandler(onCommentReceived) {
  socket.on('commentaction', onCommentReceived)
}

function unregisterHandler() {
  socket.off('commentaction')
}

function connect() {
  socket.on('connect')
}

function disconnect() {
  socket.on('disconnect')
}

function register(email, cb) {
  socket.emit('register', email, cb)
}

function join(roomid, cb) {
  socket.emit('join', roomid, cb)
}

function leave(roomid, cb) {
  socket.emit('leave', roomid, cb)
}

function comment(roomid, comment, cb) {
  socket.emit('comment', { roomid, message: comment }, cb)
}

function getRooms(cb) {
  socket.emit('rooms', null, cb)
}

function getAvailableUsers(cb) {
  socket.emit('availableClients', null, cb)
}

export default {
  registerHandler,
  unregisterHandler,
  connect,
  disconnect,
  register,
  join,
  leave,
  comment,
  getRooms,
  getAvailableUsers,
}
