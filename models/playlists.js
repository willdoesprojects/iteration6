const mongoose = require('mongoose');

const playlistsSchema = new mongoose.Schema({
    djOwner: String,
    totalSongs: Number,
    imgSrc: String,
    songs: Array //[song 1]
});

module.exports = mongoose.model("playlists", playlistsSchema);