const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    userFlag: {
        flag: Number,
    },

    playlistId: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

module.exports = mongoose.model("User", userSchema);