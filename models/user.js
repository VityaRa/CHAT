const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: String }
});

module.exports = userSchema