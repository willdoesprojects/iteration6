const mongoose = require('mongoose');

const playlistsSchema = new mongoose.Schema({
    djOwner: String,
    totalSongs: Number,
    imgSrc: String,
    songs: Array
});

module.exports = mongoose.model("playlists", playlistsSchema);