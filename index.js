const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }

});

const PORT = 4000 || process.env.PORT



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('name', (name) => {
        console.log(`new name: ${name}`);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT);
console.log('listening on port ', PORT);

process.on("SIGINT", async () => {
    console.log("Приложение завершило работу");
    process.exit();
});