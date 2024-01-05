const UserModel = require("../models/Users");
const SongModel = require("../models/Songs");
const ListenersModel = require("../models/Listeners");
const DJsModel = require("../models/Playlists");

const favSongsListHandler = async (req, res) => {
    const user = await ListenersModel.findOne({userId: req.session.userId});
    res.json(user);
}

const addFavSongHandler = async (req, res) => {
    const { song } = req.body;

    const user = await ListenersModel.findOne({userId: req.session.userId});

    user.favoriteSongs.push(song);

    await user.save();
}

const removeFavSongHandler = async (req, res) => {
    const { song } = req.body;

    const user = await ListenersModel.findOne({userId: req.session.userId});
    user.favoriteSongs.remove(song);
    user.queuedSongs.remove(song);

    await user.save();
}

const getSongDJs = async (req, res) => {
    const DJSongs = await DJsModel.find();
    const user = await UserModel.findById(req.session.userId);

    res.json({DJs: DJSongs, CurrDJ: user.playlistId});
}

const addDJQueueHandler = async (req, res) => {
    const { dj } = req.body;
    const user = await UserModel.findById(req.session.userId);


    if (user.playlistId == null) {
        user.playlistId = dj._id;
        req.session.playlistId = dj._id;
        req.session.save();
    }

    const listener = await ListenersModel.findOne({userId: req.session.userId});
    listener.queuedDJs.push(dj);

    await listener.save();

    await user.save();

}

const removeDJHandler = async (req, res) => {
    const { dj } = req.body;
    
    const user = await UserModel.findById(req.session.userId);
    const listener = await ListenersModel.findOne({userId: req.session.userId});

    if (user.playlistId == dj._id) {
        user.playlistId = null;
        req.session.playlistId = null;

        await user.save();
        await req.session.save();
    }

    listener.queuedDJs.remove(dj);
    await listener.save();

}

const DJRetrieveHandler = async (req, res) => {
    const listener = await ListenersModel.findOne({userId: req.session.userId});

    res.json(listener.queuedDJs);
}

const setQueueHandler = async (req, res) => {
    const user = await UserModel.findById(req.session.userId);

    await UserModel.findByIdAndUpdate(req.session.userId, { $set: { queuedSongs: user.favoriteSongs } });

    await user.save();
}


module.exports = { favSongsListHandler, addFavSongHandler, removeFavSongHandler, getSongDJs, setQueueHandler, addDJQueueHandler, removeDJHandler, DJRetrieveHandler };