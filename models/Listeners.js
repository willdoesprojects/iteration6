const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listnerSchema = new Schema({
    
    favoriteSongs: {
        type: Array
    },

    favoriteDJs: {
        type: Array
    },

    queuedSongs: {
        type: Array
    },

    queuedDJs: {
        type: Array
    }
});

module.exports = mongoose.model("User", listnerSchema);