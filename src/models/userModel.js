const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    avatar: String,
    rol: String,
    onCrypt: Boolean,
    idSocket: String
});

module.exports = mongoose.model("User", userSchema);