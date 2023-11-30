const ListenersModel = require("../models/Listeners");
const UserModel = require("../models/Users");
const DJModel = require("../models/playlists");

const homePageHandler = async (req, res) => {
    if (!req.session.index) {
        req.session.index = 0;
    }

    if (req.session.isAuth) {
        
        const userListener = await ListenersModel.findOne({userId:req.session.userId});
        const user = await UserModel.findById(req.session.userId);

        if (userListener.queuedSongs.length === 0) {
            res.render('index', {func: "logOut()", link: "#", username: user["username"], songName: "Hello", artist: "Please add DJs to begin."});
        }
        
        else {
            res.render('index', {func: "logOut()", link: "#", username: user["username"], songName: userListener["queuedSongs"][req.session.index]["name"], artist: userListener["queuedSongs"][req.session.index]["artist"]});

        }
        
    }
    else {
        res.render('index', {func: "", link: "./signup", username: "Login", songName: "Welcome!", artist: "Please Login to Get Started."});
    }
}


const getSongQueueHandler = async (req, res) => {
    // const user = await UserModel.findById(req.session.userId);
    console.log(req.session.playlistId);
    const userListener = await DJModel.findById(req.session.playlistId);

    if (userListener == null) {
        res.json(null);
    }
    
    else {
        res.json({queuedSongs: userListener.songs, index: req.session.index});
    }
    
};

const getIndexIncrHandler = async (req, res) => {
    const { index } = req.body;
    req.session.index = index;
    res.redirect("/");
    
}

const getIndexDecrHandler = async (req, res) => {
    const { index } = req.body;
    req.session.index = index;
    res.redirect("/");
    
}



module.exports = { homePageHandler, getSongQueueHandler, getIndexIncrHandler, getIndexDecrHandler };


