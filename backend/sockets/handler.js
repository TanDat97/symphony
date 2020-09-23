function makeHandleEvent(client, clientManager, roomManager) {

  function ensureExists(getter, rejectionMessage) {
      return new Promise(function (resolve, reject) {
          const res = getter()
          return res ? resolve(res) : reject(rejectionMessage)
      })
  }

  function ensureUserSelected(clientId) {
      return ensureExists(() =>
          clientManager.getUserByClientId(clientId),
          'select user first'
      )
  }

  function ensureValidRoom(roomid) {
      return ensureExists(() =>
          roomManager.getRoomById(roomid),
          `invalid room id: ${roomid}`
      )
  }

  function ensureValidRoomAndUserSelected(roomid) { 
      return new Promise((resolve, reject) => { 
          Promise.all([ensureValidRoom(roomid), ensureUserSelected(client.id)])
          .then(([room, user]) => {
              const res = { room, user }
              resolve(res)
          })
      }) 
     
  }

  function handleEvent(roomid, createEntry) {
      return ensureValidRoomAndUserSelected(roomid)
          .then(res => {
              // append event to comment history
              const entry = { user: res.user, ...createEntry() }
              res.room.addEntry(entry)
              // notify other clients in room 
              res.room.broadcastComment({ room: roomid, ...entry })
              return res.room
          })
  }

  return handleEvent
}

module.exports = function (client, clientManager, roomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, roomManager)

  function handleRegister(email, callback) {
      clientManager.registerClient(client, email)
      return callback(null, email)
  }

  function handleJoin(roomid, callback) {
      const createEntry = () => ({ event: `joined ${roomid}` })
      handleEvent(roomid, createEntry)
          .then(room => {
              // add member to room and can see comment
              room.addUser(client)

              // send comment history to client
              callback(null, room.getCommentHistory())
          })
          .catch(callback)
  }

  function handleLeave(roomid, callback) {
      const createEntry = () => ({ event: `left ${roomid}` })
      handleEvent(roomid, createEntry)
          .then(room => {
              // remove member from room
              room.removeUser(client)
              callback(null)
          })
          .catch(callback)
  }

  function handleComment(commentObject, callback) {
      const createEntry = () => ({ content: commentObject.content })
      handleEvent(commentObject.roomid, createEntry)
          .then(() => callback(null))
          .catch(callback)
  }

  function handleGetRooms(_, callback) {
      return callback(null, roomManager.serializeRooms())
  }

  function handleGetAvailableClients(_, callback) {
      return callback(null, clientManager.getAvailableClients())
  }

  function handleDisconnect() {
      // remove user profile
      clientManager.removeClient(client)
      // remove member from all chatrooms
      roomManager.removeClient(client)
  }

  return {
      handleRegister,
      handleJoin,
      handleLeave,
      handleComment,
      handleGetRooms,
      handleGetAvailableClients,
      handleDisconnect,
  }
}
