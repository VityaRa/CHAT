//init modules
const express = require('express')();
const http = require("http").createServer(express);

//cors
const cors = require("cors");

//init mongo
const mongoose = require("mongoose");

//init helpers
const initQueriesHelpers = require("./queriesHelpers")
const setSocketIO = require("./socketHelpers");

//connect env vars
require("dotenv").config();

express.use(cors());

mongoose.connect(
    process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

//global variables for easier using
let collection;
let queriesHelpers;

const PORT = process.env.PORT || 4000

//Start server
http.listen(PORT, async () => {
    try {
        db.on("error", console.error.bind(console, "Ошибка подключения к MongoDB: "));
        db.once("open", async function () {
            collection = db.collection("rooms");
            queriesHelpers = initQueriesHelpers(collection)
            console.log(`Listening on port: ${http.address().port}`);
        });

    } catch (e) {
        console.error(e);
    }
});

//Start socketIO
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})

const initSocketHelpers = setSocketIO(io)

//Main socket events handler
io.on('connection', (socket) => {
    //Init socket helper
    const socketHelper = initSocketHelpers(socket, queriesHelpers)

    //Init socket helper's functions
    socketHelper.createRoom()
    socketHelper.joinRoom()
    socketHelper.message()
    socketHelper.disconnect()
});


process.on("SIGINT", async () => {
    console.log("Приложение завершило работу");
    process.exit();
});