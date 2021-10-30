const mongoose = require("mongoose");
const userSchema = require("./user.js")
const messageSchema = require("./message.js")

const roomSchema = new mongoose.Schema({
    id: String,
    messages: [{ type: messageSchema }],
    users: [{type: userSchema}]
});

module.exports = mongoose.model("room", roomSchema);