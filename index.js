const express = require('express')();
const cors = require("cors");
const http = require("http").createServer(express);
const mongoose = require("mongoose");

const objectId = require("mongodb").ObjectId;

const roomModel = require("./models/room")
const Message = mongoose.model("Message", require("./models/message"));
const User = mongoose.model("User", require("./models/user"));


express.use(cors());

mongoose.connect(
    `mongodb+srv://Vityarka:2301some36rand41@cluster0.nlskh.mongodb.net/test-mongo?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;

let collection;

const PORT = process.env.PORT || 4000

const removeUser = async (userId, roomId) => {
    await collection.updateOne({ _id: roomId }, { $pull: { users: { id: userId } } })
}

const addUser = async (userInfo, roomId) => {
    await collection.updateOne({ _id: roomId }, { $push: { users: userInfo } });
}

const getUsers = async (roomId) => {
    const users = (await collection.findOne({ _id: roomId }, { projection: { _id: 0, messages: 0 } })).users
    return users
}

const getRoom = async (roomId) => {
    return await collection.findOne({ _id: roomId });
}

const createRoom = async () => {
    const newRoom = new roomModel({ messages: [], users: [] })
    const { insertedId } = await collection.insertOne(newRoom)
    return String(insertedId);
}

const removeRoom = async (roomId) => {
    await collection.deleteOne({ _id: roomId })
}

const addMessage = async (messageInfo, roomId) => {
    await collection.updateOne({ _id: roomId }, { $push: { messages: messageInfo } })
}

// const removeMessage = async (messageId, roomId) => {
//     await collection.updateOne({ _id: roomId }, { $pull: { messages: { id: messageId } } })
// }

const getMessages = async (roomId) => {
    const messages = (await collection.findOne({ _id: roomId }, { projection: { _id: 0, users: 0 } })).messages
    return messages
}

const joinSocket = (socket, roomId) => {
    socket.join(roomId);
    socket.activeRoom = roomId;
}


http.listen(PORT, async () => {
    try {
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", async function () {
            collection = db.collection("rooms");
            console.log(`Listening on port: ${http.address().port}`);
        });

    } catch (e) {
        console.error(e);
    }
});

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket) => {
    //Присоединение: 
    //Добавить юзера в дб

    socket.on("create_room", async (userData) => {
        const roomId = await createRoom();
        await addUser(userData, new objectId(roomId));

        joinSocket(socket, roomId)
        io.to(roomId).emit("new_connection", userData)

        socket.emit("room_id", roomId);
    })

    socket.on('join_room', async (data) => {
        const roomId = data.roomId
        const { user } = data

        const isRoomActive = await getRoom(new objectId(roomId));

        if (isRoomActive) {
            await addUser(user, new objectId(roomId))

            joinSocket(socket, roomId)

            io.to(roomId).emit("new_connection", user)

            const currentUsers = await getUsers(new objectId(roomId))
            socket.emit("user_list", currentUsers)

            const currentMessages = await getMessages(new objectId(roomId))
            socket.emit("message_list", currentMessages)
        } else {
            socket.emit("error_inactive_chat", "Данный чат неактивен")
        }


    });

    //Сообщение:
    //Добавление сообщения в бд, отправка сообщения всем пользователям
    socket.on('message', async (data) => {
        const roomId = socket.activeRoom;
        const { message, user } = data

        const newMessage = { message, date: new Date().toLocaleString(), user };

        await addMessage(newMessage, new objectId(roomId));

        io.to(roomId).emit("on_message", newMessage)
    });

    //Выход юзера:
    //Удаление пользователя из бд, отправка нового списка юзеров


    socket.on('disconnect', async (data) => {
        io.to(socket.activeRoom).emit("end_connection", socket.id)
        await removeUser(socket.id, new objectId(socket.activeRoom))

        try {
            const usersCount = (await getUsers(new objectId(socket.activeRoom))).length
            if (!usersCount) {
                await removeRoom(new objectId(socket.activeRoom))
            }
        } catch (e) {
            await removeRoom(new objectId(socket.activeRoom))
        }
        socket.leave()

    });
});


process.on("SIGINT", async () => {
    console.log("Приложение завершило работу");
    process.exit();
});