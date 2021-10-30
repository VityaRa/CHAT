const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = require("./user.js")

const messageSchema = new Schema({
    text: { type: String },
    date: { type: Date },
    user: { type: userModel }
});

module.exports = messageSchema;