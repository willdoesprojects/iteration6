const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listnerSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

    currentDJ: {
        type: mongoose.Schema.Types.ObjectId
    },

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

module.exports = mongoose.model("Listeners", listnerSchema);