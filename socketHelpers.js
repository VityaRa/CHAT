const objectId = require("mongodb").ObjectId;

//some closuring for file splitting

module.exports = setSocketIO = (io) => (socket, queriesHelpers) => {
    return {
        //, , , 
        createRoom: () => {
            socket.on("create_room", async (userData) => {
                //Creating room
                const roomId = await queriesHelpers.createRoom();

                //Add first user to DB
                await queriesHelpers.addUser(userData, new objectId(roomId));

                //Join socket to room
                queriesHelpers.joinSocket(socket, roomId)

                //Send user data to users (currently one)
                io.to(roomId).emit("new_connection", userData)

                //Send user room address
                socket.emit("room_id", roomId);
            })
        },
        joinRoom: () => {
            socket.on('join_room', async (data) => {
                //Get data from new user
                const roomId = data.roomId
                const { user } = data

                //Check for room activeness
                const isRoomActive = await queriesHelpers.getRoom(new objectId(roomId));

                if (isRoomActive) {

                    //Add user to DB
                    await queriesHelpers.addUser(user, new objectId(roomId))

                    //Join socket to room
                    queriesHelpers.joinSocket(socket, roomId)

                    //Send user data to all users in room
                    io.to(roomId).emit("new_connection", user)

                    //Send active users to new user
                    const currentUsers = await queriesHelpers.getUsers(new objectId(roomId))
                    socket.emit("user_list", currentUsers)

                    //Send all messages to new user
                    const currentMessages = await queriesHelpers.getMessages(new objectId(roomId))
                    socket.emit("message_list", currentMessages)
                } else {
                    socket.emit("error_inactive_chat", "Данный чат неактивен")
                }
            });
        },
        message: () => {
            socket.on('message', async (data) => {

                //Get message data from user
                const roomId = socket.activeRoom;
                const { message, user } = data

                //Create and add new message to DB
                const newMessage = { message, date: new Date().toLocaleString(), user };
                await queriesHelpers.addMessage(newMessage, new objectId(roomId));

                //Send created message to all users in room
                io.to(roomId).emit("on_message", newMessage)
            });
        },
        disconnect: () => {
            socket.on('disconnect', async () => {
                //Send to all users info about disconnected user and remove his data from DB
                io.to(socket.activeRoom).emit("end_connection", socket.id)
                await queriesHelpers.removeUser(socket.id, new objectId(socket.activeRoom))

                //If no user in room, remove room
                try {
                    const usersCount = (await queriesHelpers.getUsers(new objectId(socket.activeRoom))).length
                    if (!usersCount) {
                        await queriesHelpers.removeRoom(new objectId(socket.activeRoom))
                    }
                } catch (e) {
                    await queriesHelpers.removeRoom(new objectId(socket.activeRoom))
                }
                socket.leave()
            });
        }
    }
}