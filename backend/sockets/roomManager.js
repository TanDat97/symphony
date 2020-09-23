const Room = require('./room')

module.exports = function () {
    // mapping of all available chatrooms
    const rooms = new Map()

    function removeClient(client) {
      rooms.forEach(c => c.removeUser(client))
    }

    function getRoomById(roomId) {
        if (rooms.get(roomId) === undefined) {
          rooms.set(roomId, Room(roomId))
        }
        return rooms.get(roomId)
    }

    function serializeRooms() {
        return Array.from(rooms.values()).map(c => c.serialize())
    }

    return {
        removeClient,
        getRoomById,
        serializeRooms,
    }
}
