// public/myscript.js

document.addEventListener('DOMContentLoaded', function () {
    const sendDataButton = document.getElementById('sendDataButton');
    const retrieveSongDataButton = document.getElementById('retrieveSongDataButton');
    const retrievePlaylistDataButton = document.getElementById('retrievePlaylistDataButton');
    const displaySongDataDiv = document.getElementById('displaySongData');
    const displayPlaylistDataDiv = document.getElementById('displayPlaylistData');

    //Retrieve data button
    retrieveSongDataButton.addEventListener('click', function () {
        console.log("retrieveSongDataButton click");
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

    //Retrieve data button
    retrievePlaylistDataButton.addEventListener('click', function () {
        console.log("retrievePlaylistDataButton click");
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
            data.data.forEach(audio => {
                displayPlaylistDataDiv.appendChild(createPlaylistContainer(audio));
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

    function createAddButton(audio){
        console.log("createAddButton");
        const addButtonContainer = document.createElement('div');

        const playButton = document.createElement('button');
        playButton.textContent = "Add";
        playButton.classname = "add-button";
        addButtonContainer.appendChild(playButton);

        const addSongDropdown = document.createElement('div');
        addSongDropdown.className = "dropdown-content";
        addSongDropdown.style = "max-height:150px;overflow-y:scroll;";

        fetch('/retrievePlaylistData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            // Display retrieved data in the HTML
            data.data.forEach(audio => {
                let pName = document.createElement('a');
                pName.innerHTML = audio.name;
                addSongDropdown.appendChild(pName);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

        addButtonContainer.appendChild(addSongDropdown);
        return addButtonContainer;
    }

    // Function to create a play button for each audio element
    function createPlayButton(audio) {
        console.log("createPlayButton");
        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', function () {
            currCover.src = audio.cover;
            currSongName.innerHTML = audio.name;
            currSongArtist.innerHTML = audio.artist;
            audioPlayer.src = audio.path;
            audioPlayer.volume = .05;
            audioPlayer.play();
        });
        return playButton;
    }

    // Function to create a container with audio information and play button
    function createSongContainer(audio) {
        console.log("createSongContainer");
        //Song item
        let songTabListItem = document.createElement('div');
        songTabListItem.className = "side-tab-list-item";

        //Cover
        let songTabCoverContainer = document.createElement('div');
            let songTabCoverImage = document.createElement('img');
            songTabCoverImage.src = audio.cover;
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

    function createPlaylistContainer(audio) {
        console.log("createPlaylistContainer");
        //Song item
        let playlistTabListItem = document.createElement('div');
        playlistTabListItem.className = "side-tab-list-item";

        //Cover
        let playlistTabCoverContainer = document.createElement('div');
            let playlistTabCoverImage = document.createElement('img');
            playlistTabCoverImage.src = audio.cover;
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

        //Play button
        let playlistPlayButton = createPlayButton(audio);
        playlistTabListItem.appendChild(playlistPlayButton);

        return playlistTabListItem;
    }
});
