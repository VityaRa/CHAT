const roomModel = require("./models/room")

module.exports = initHelpers = (collection) => {
    return {
        removeUser: async (userId, roomId) => {
            await collection.updateOne({ _id: roomId }, { $pull: { users: { id: userId } } })
        },

        addUser: async (userInfo, roomId) => {
            await collection.updateOne({ _id: roomId }, { $push: { users: userInfo } });
        },

        getUsers: async (roomId) => {
            const users = (await collection.findOne({ _id: roomId }, { projection: { _id: 0, messages: 0 } })).users
            return users
        },

        getRoom: async (roomId) => {
            return await collection.findOne({ _id: roomId });
        },

        createRoom: async () => {
            const newRoom = new roomModel({ messages: [], users: [] })
            const { insertedId } = await collection.insertOne(newRoom)
            return String(insertedId);
        },

        removeRoom: async (roomId) => {
            await collection.deleteOne({ _id: roomId })
        },

        addMessage: async (messageInfo, roomId) => {
            await collection.updateOne({ _id: roomId }, { $push: { messages: messageInfo } })
        },

        getMessages: async (roomId) => {
            const messages = (await collection.findOne({ _id: roomId }, { projection: { _id: 0, users: 0 } })).messages
            return messages
        },

        //Function for joining new socket to current room
        joinSocket: (socket, roomId) => {
            socket.join(roomId);
            socket.activeRoom = roomId;
        },
    }
}

