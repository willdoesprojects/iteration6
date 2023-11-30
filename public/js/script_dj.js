// public/myscript.js
currSongIndex = 0;
playingFromPlaylist = false;

document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    //const sendDataButton = document.getElementById('sendDataButton');
    const retrieveSongDataButton = document.getElementById('retrieveSongDataButton');
    //const retrievePlaylistDataButton = document.getElementById('retrievePlaylistDataButton');
    const displaySongDataDiv = document.getElementById('displaySongData');
    const displayPlaylistDataDiv = document.getElementById('displayPlaylistData');
    const playPlaylistButton = document.getElementById('playPlaylistButton');

    // Retrieves and displays song data
    retrieveSongDataButton.addEventListener('click', function () {
        //console.log("retrieveSongDataButton click");
        fetch('/retrieveSongData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            displaySongDataDiv.innerHTML = ''; // Clear previous content
            // Display retrieved data in the HTML
            data.data.forEach(audio => {
                displaySongDataDiv.appendChild(createSongContainer(audio));
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

        //temp code that accesses the song search bar
        let forminput = document.getElementById('song-search-bar');
        let input = forminput.getElementsByTagName('input');
        console.log(input[0].value);
    });

    // Plays the first song in the playlist
    playPlaylistButton.addEventListener('click', function () {
        console.log("playPlaylistButton clicked")

        fetch('/retrievePlaylistData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);

            if (data.data.songs.length != 0){
                currSongIndex = 0;
                playSong(data.data.songs[currSongIndex]);
                playingFromPlaylist = true;
            }
            else{
                alert('No songs found in the current playlist');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    audioPlayer.addEventListener('ended', function(){
        if (playingFromPlaylist){
            fetch('/retrievePlaylistData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                
                currSongIndex++;
                if (currSongIndex < data.data.totalSongs){
                    console.log("PLAYING NEXT SONG: " + currSongIndex);
                    playSong(data.data.songs[currSongIndex]);
                }
                else{console.log("NO SONGS LEFT: " + currSongIndex);}
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }    
    });

    // Function to create an add button for each song element
    function createAddButton(audio){
        //console.log("createAddButton");
        const addButtonContainer = document.createElement('div');

        const playButton = document.createElement('button');
        playButton.textContent = "Add";
        playButton.classname = "add-button";

        playButton.addEventListener("click", function(){
        
        let title = audio.name;
        // determine which dj's playlist we need
        let dj = "Mitski";
    
        try{
            console.log(title);
    
            // Fetch the getSong post
            const response = fetch('/getSong', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Pass in necessary vals for query
                body: JSON.stringify({
                    songTitle: title,
                    djOwner: dj
                }),
    
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server Response', data);
    
                // IF unsuccessful alert user with appropriate message
                if(!data.success){
                    console.log(data.message);
                    alert(data.message);
                }
                // Otherwise update dom to reflect backend
                else{
                    //updateDOM(); 
                    fetch('/retrievePlaylistData', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Server response:', data);
                        displayPlaylistDataDiv.innerHTML = ''; // Clear previous content
            
                        // Display retrieved data in the HTML
                        data.data.songs.forEach(audio => {
                            displayPlaylistDataDiv.appendChild(createPlaylistContainer(audio));
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    }); 
                }
            })
            .catch(error => {
                console.error('Fetch Error1', error);
            })
        }
        catch(error){
            console.error('Fetching Error2:', error);
        }
    
        });

        addButtonContainer.appendChild(playButton);

        const addSongDropdown = document.createElement('div');
        addSongDropdown.className = "dropdown-content";
        addSongDropdown.style = "max-height:150px;overflow-y:scroll;";
        addButtonContainer.appendChild(addSongDropdown);
        return addButtonContainer;
    }

    // Function to create a play button for each song element
    function createPlayButton(audio) {
        //console.log("createPlayButton");
        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', function () {
            //const name = (element) => element = name
            //update currSongIndex with data.data.songs.findIndex(name);
            playingFromPlaylist = false;
            fetch('/retrievePlaylistData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
    
                lookingSong = (element) => element.name == audio.name;
                lookingIndex = data.data.songs.findIndex(lookingSong);
                if (lookingIndex != -1){
                    currSongIndex = lookingIndex;
                    
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
            playSong(audio);
        });
        return playButton;
    }

    // Function to create a remove song button for each playlist element
    function createRemoveButton(audio) {
        //console.log("createRemoveButton")
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Delete';
        removeButton.addEventListener('click', function () {
            let title = audio.name;
            // determine which dj's playlist we need
            let dj = "Mitski";
            
            try{
                console.log(title);
                const response = fetch('/removeSong', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Necessary query vals
                    body: JSON.stringify({
                        songTitle: title,
                        djOwner: dj
                    }),
        
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Server Response', data);
        
                    // IF unsuccessful, alert user with appropriate message
                    if(!data.success){
                        console.log(data.message);
                        alert(data.message);
                    }
                    // IF successful update dom to reflect backend
                    else{
                        //updateDOM();
                        fetch('/retrievePlaylistData', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Server response:', data);
                            displayPlaylistDataDiv.innerHTML = ''; // Clear previous content
                
                            // Display retrieved data in the HTML
                            data.data.songs.forEach(audio => {
                                displayPlaylistDataDiv.appendChild(createPlaylistContainer(audio));
                            });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    
                        // Update player and global song pointer using the backend to determine
                        // If a song change is necessary upon deletion
                        // IF last song was deleted 
                        if(data.doc.totalSongs <= 0){
                            audioSource.src = "#";
                            audioPlay.load();
                            document.getElementById("playPause").innerHTML="&#x23F5";
                            currSong = 0;
                            updatePlayText();
                        }
                        //IF song that was currently playing is deleted
                        else if(currSong == data.index){
                            --currSong;
                            playNext();
                        }
                    }
                })
                .catch(error => {
                    console.error('Fetch Error1', error);
                })
            }
            catch(error){
                console.error('Fetching Error2:', error);
            }
        });
        return removeButton;
    }

    // Function to create a container with audio information, play, and add buttons
    function createSongContainer(audio) {
        //console.log("createSongContainer");
        //Song item
        let songTabListItem = document.createElement('div');
        songTabListItem.className = "side-tab-list-item";

        //Cover
        let songTabCoverContainer = document.createElement('div');
            let songTabCoverImage = document.createElement('img');
            songTabCoverImage.src = audio.imageLoco;
            songTabCoverImage.alt = "CoverImg";
            songTabCoverImage.style = "width:90px;height:90px;";
            songTabCoverContainer.appendChild(songTabCoverImage);
        songTabListItem.appendChild(songTabCoverContainer);

        //Name
        let songTabName = document.createElement('div');
        songTabName.textContent = audio.name;
        songTabName.className = "song-name";
        songTabListItem.appendChild(songTabName);

        //Artist 
        let songTabArtist = document.createElement('div');
        songTabArtist.textContent = audio.artist;
        songTabArtist.className = "song-artist";
        songTabArtist.style = "margin-left:auto";
        songTabListItem.appendChild(songTabArtist);

        //Add button
        let songAddButton = createAddButton(audio);
        songTabListItem.appendChild(songAddButton);

        //Play button
        let songPlayButton = createPlayButton(audio);
        songTabListItem.appendChild(songPlayButton);

        return songTabListItem;
    }

    // Function to create a container with playlist information, play, and remove buttons
    function createPlaylistContainer(audio) {
        //console.log("createPlaylistContainer");
        //Song item
        let playlistTabListItem = document.createElement('div');
        playlistTabListItem.className = "side-tab-list-item";

        //Cover
        let playlistTabCoverContainer = document.createElement('div');
            let playlistTabCoverImage = document.createElement('img');
            playlistTabCoverImage.src = audio.imageLoco;
            playlistTabCoverImage.alt = "CoverImg";
            playlistTabCoverImage.style = "width:90px;height:90px;";
            playlistTabCoverContainer.appendChild(playlistTabCoverImage);
        playlistTabListItem.appendChild(playlistTabCoverContainer);

        //Name
        let playlistTabName = document.createElement('div');
        playlistTabName.textContent = audio.name;
        playlistTabName.className = "playlist-name";
        playlistTabListItem.appendChild(playlistTabName);

        //Artist 
        let playlistTabArtist = document.createElement('div');
        playlistTabArtist.textContent = audio.artist;
        playlistTabArtist.className = "playlist-artist";
        playlistTabArtist.style = "margin-left:auto";
        playlistTabListItem.appendChild(playlistTabArtist);

        //Remove button
        let playlistRemoveButton = createRemoveButton(audio);
        playlistTabListItem.appendChild(playlistRemoveButton);

        //Play button
        let playlistPlayButton = createPlayButton(audio);
        playlistTabListItem.appendChild(playlistPlayButton);

        return playlistTabListItem;
    }

    // Function that plays a given song
    function playSong(audio){
        currCover.src = audio.imageLoco;
        currSongName.innerHTML = audio.name;
        currSongArtist.innerHTML = audio.artist;
        audioPlayer.src = audio.songLoco;
        audioPlayer.volume = .05;
        audioPlayer.play();
    }

    // Populates playlist/song tabs upon loading page
    function initializeTabs(){
        //Initialize playlist tab
        fetch('/retrievePlaylistData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            displayPlaylistDataDiv.innerHTML = ''; // Clear previous content
    
            // Display retrieved data in the HTML
            data.data.songs.forEach(audio => {
                displayPlaylistDataDiv.appendChild(createPlaylistContainer(audio));
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

        //Initialize song tab
        fetch('/retrieveSongData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            displaySongDataDiv.innerHTML = ''; // Clear previous content
            // Display retrieved data in the HTML
            data.data.forEach(audio => {
                displaySongDataDiv.appendChild(createSongContainer(audio));
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


});

async function logOut() {
    await fetch('/logout', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        
    }
    )

    location.reload();
};