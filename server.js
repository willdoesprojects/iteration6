const express = require("express");
const session = require("express-session");
const mongodbSession = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

const uri = "mongodb+srv://swe432:swe432@iteration5.4lxqgj9.mongodb.net/?retryWrites=true&w=majority";

const accountsRoute = require("./routes/AccountsRouter");
const Preference = require("./routes/PreferencesRouter");
const songsRoute = require("./routes/SongsRouter");
const musicPlayerRoute = require("./routes/MusicPlayerRouter");

const crypto = require('crypto');
//const { db } = require("./models/Users");

mongoose.connect(uri).then(() => {
    console.log("Connected!");
})

const store = new mongodbSession({
    uri: uri,
    collection: "Sessions"
})

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/'));

const sessionSecret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store
}))

app.set('view engine', 'ejs');
app.set('views', './views/pages');

app.use(express.urlencoded({ extended: true}));

//Route for music player/home page
app.use(musicPlayerRoute);

//Route for signing and creating accounts
app.use(accountsRoute);

//Route for Preference page
app.use(Preference);

//Route for CRUD operations on songs
app.use(songsRoute);

//Logoout route
app.post("/logout", async (req, res) => {

    if (req.session.isAuth) {
        req.session.destroy();
        res.redirect("/");
    }
})

/***************************** Ronnie's Code *****************************/
// Mongoose Fields
var songData = require('./models/Songs');
var playlists = require('./models/playlists');

var db;

// Static Files\
/*
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/javascript', express.static(__dirname + 'public/javascript'));
app.use('/images', express.static(__dirname + 'public/images'));
app.use('/media', express.static(__dirname + 'public/media'));*/

// Open connection to Mongo db, and fills the song database with songs, if not filled yet

const main = async() => {
    try{
  
      // Create connection
      //await mongoose.connect(uri);
      db = mongoose.connection;
  
      //console.log('connected to db');
  
      // Check if db is filled, if not fill it, with necessary info
      var currSongData = await songData.find({});
      var currPlaylist = await playlists.find({});
  
      // if Songs have not been added to the database of songs, adds them
      // Otherwise, skips this step
      if(currSongData.length <= 3){
        const songs = [ {title: 'I Bet On Losing Dogs', artist: 'Mitski', songLoco: 'songs/iBetOnLosingDogs.mp3', imageLoco: 'images/mitski.png'},
                        {title: 'Fade Into You', artist: 'Mazzy Star', songLoco: 'songs/01 Fade into You.m4a', imageLoco: 'images/mazzy_Album.jpg'},
                        {title: 'Cheers', artist: 'Faye Webster', songLoco: 'songs/06 Cheers.m4a', imageLoco: 'images/Cheers_Album.jpg'},
                        {title: 'Think About It', artist: 'Dev Lemons', songLoco: 'songs/06 Think About It.m4a', imageLoco: 'images/delusional_Album.jpg'},
                        {title: 'Baby Came Home 2', artist: 'The Neighbourhood', songLoco: 'songs/07 Baby Came Home 2 _ Valentines.m4a', imageLoco: 'images/wiped out.png'},
                        {title: 'My Love Mine All Mine', artist: 'Mitski', songLoco: 'songs/07 My Love Mine All Mine.m4a', imageLoco: 'images/TLIIASAW_Album.png'},
                        {title: 'Thunder', artist: 'Lana Del Rey', songLoco: 'songs/10 thunder.m4a', imageLoco: 'images/BlueBanisters.png'},
                        {title: 'Ilomilo', artist: 'Billie Eilish', songLoco: 'songs/11 ilomilo.m4a', imageLoco: 'images/billie.png'},
                        {title: 'Cornerstone', artist: 'Arctic Monkeys', songLoco: 'songs/cornerstone.m4a', imageLoco: 'images/humbug.png'}
                      ];
  
        // CREATE Song Entries to fill db
        for(let i = 0; i < songs.length; i++){
  
          const newEntry = {
            name: songs[i].title,
            artist: songs[i].artist,
            songLoco: songs[i].songLoco,
            imageLoco: songs[i].imageLoco
          }
  
          songData.create(newEntry)
          .then(createEntry =>{
            console.log('Entry created successfully:', createEntry);
          })
          .catch(error =>{
            console.error('Error creating new entry:', error);
          })
        }
      }
  
      // CREATE a sample playlist entry to test functionality
      if(currPlaylist.length == 0){
  
        const newEntry = {
          djOwner: 'Mitski',
          totalSongs: 0,
          imgSrc: 'images/mitskiPFP.jpg',
          songs: []
        }
  
        playlists.create(newEntry)
        .then(createEntry =>{
          console.log('Entry created successfully:', createEntry);
        })
        .catch(error =>{
          console.log('Error creating new entry:', error);
        })
      }
    }
    catch(e){
      console.log(e.messsage);
    }
  };
  
  // calls main function for the startup of the db conection
  main();
  
  
  // add's a song to a playlist, and UPDATES the playlist accordingly
  app.post('/getSong', async (req, res) => {
  
    try{
  
      // Retrieve req body fields necessary for query
      const { songTitle } = req.body;
      const { djOwner } = req.body
      console.log({songTitle});
  
      // Check if song exists in db
      const song = await songData.findOne({name:songTitle});
  
      // If song exists
      if(song){
  
        // Check if playlist exists
        const playlist = await playlists.findOne({djOwner: djOwner});
  
        // If playlist exists
        if(playlist){
  
  
          const newTotalSongs = playlist.totalSongs + 1;
  
          // UPDATE Condition
          const condition = {djOwner: djOwner};
          // UPDATE Query, pushes new song onto array of songs
          const update = {
            $push: {
              songs: song,
            },
  
            // UPDATES the total number of songs
            $set: {
              totalSongs: newTotalSongs,
            },
          }
  
          // IF playlist is not full and exists
          if(playlist.totalSongs < 6){
  
            // Send UPDATE query
            playlists.updateOne(condition, update)
            .then(result =>{
              res.json({success: true, song});
            })
            .catch(error =>{
              res.status(404).json({success: false, message: 'Failed to update'});
            })
          }
          // IF playlist is full send fail, with err message to alert user
          else{
            res.json({success: false, message: 'Not enough room for new songs'});
          }
        }
        else{
          res.status(404).json({success: false, message: 'Playlist could not be found'});
        }
      }
      // Alert user that the song is not in the db
      else{
        res.status(404).json({success: false, message: 'Song could not be found'});
      }
    }
    catch(error){
      console.log('Error in server', error);
      res.status(500).json({success: false});
    }
  })
  
  
  // REMOVE Song from playlist
  app.post('/removeSong', async (req, res) => {
  
    try{
      // Similar to Add song, get req body for query
      const { songTitle } = req.body;
      const { djOwner } = req.body
      console.log(songTitle);
      const song = await songData.findOne({name: songTitle});
  
      // Find playlist to edit
      await playlists.findOne({djOwner: djOwner})
      .then(doc =>{
  
        // When found, find first index of song to be removed, and remove it from the array
        if(doc){
          console.log(song);
          const index = doc.songs.findIndex(song => song.name == songTitle);
  
          // If there are no songs to remove in the playlist, alert the user via message
          if(doc.totalSongs == 0){
            res.status(404).json({success: false, message:'No songs to remove in playlist'});
          }
          // IF song exists and can be removed
          else if(index != -1){
            doc.totalSongs = doc.totalSongs - 1;
            doc.songs.splice(index, 1);
  
            // Save changes, and return the playlist, and index for dom manipulation
            doc.save();
            res.json({success: true, doc, index});
          }
          // IF song is not in the playlist, alert the user via message
          else{
            res.status(404).json({success: false, message:'Song is not currently in the playlist'});
          }
        }
      })
      .catch(error =>{
        console.log(error);
        res.status(404).json({success: false, message:'Playlist could not be found'});
      })
    }
    catch(error){
      console.log('Error in server', error);
      res.status(500).json({success: false});
    }
  })
  
  //for dom manipulation, get playlist, and send to req
  app.post('/getUpdate', async (req, res) => {
  
    try{
      const { djOwner } = req.body
  
      const playlist = await playlists.findOne({djOwner:djOwner});
  
      if(playlist){
        res.json({success: true, playlist})
      }
      else{
        res.status(404).json({success: false, message: 'Playlist could not be found'});
      }
    }
    catch(error){
      console.log('Error in server', error);
      res.status(500).json({success: false});
    }
  })
  
  // ATTEMPT at a login, redirects, upon session username enter
  /*
  app.post('/login', (req, res)=>{
    req.session.username = req.body.username;
    res.redirect('/homepage');
  })
  
  // Start page
  app.get('/', function(req, res){
    res.render('pages/login');
  })
*/
  
  // Producer page, passes title and cssFile as passed in ejs variables 
  app.get('/homepage', function(req, res) {
    const title = 'Producer Home Screen';
    const cssFile = 'css/producer.css';
    res.render('ProducerPage',{title, cssFile});
  });
  
  // dj Playlist page, passes in previous ejs variables, and new db doc, for static and dynamic variable creation
  app.get('/djPlaylist', async function(req, res) {
    var playlist = await playlists.findOne({djOwner: 'Mitski'});
    const title = 'DJ Playlist Screen';
    const cssFile = 'css/prod-djPlaylist.css';
  
    res.render('djPlaylist',{
      title,
      cssFile,
      playlist: playlist
    });
  });

/*************************** End of Ronnie's Code ************************/

let port = 8080;
app.listen(port, () => {
 console.log("Server running at port= " + port);
});

