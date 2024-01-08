/*
    Search Bar Option
*/
song_dj_list = []
favoriteSongList = []
dj_list = []

// async function fetchSongData() {
//     const response = await fetch("/listdjsongs");
//     const data = await response.json();
//     return data; 
// }

// fetchSongData().then((data) => {
//     if (data.CurrDJ == null) {
//         for (let i = 0; i < data.DJs.length; i++) {
//             song_dj_list.push(data.DJs[i]);
//         }
//     }

//     else {
//         for (let i = 0; i < data.DJs.length; i++) {
//             if (data.DJs[i]._id === data.CurrDJ) {
//                 for (let j = 0; j < data.DJs[i].songs.length; j++) {
//                     song_dj_list.push(data.DJs[i].songs[j]);
//                 }
//             }
//             song_dj_list.push(data.DJs[i]);
//         }

//     }
// })


let liked_songs = document.querySelector(".liked-songs");
let liked_djs = document.querySelector(".liked-djs")

function search_bar() {
    let search_results = document.querySelector(".results");
    let search_input = document.getElementById("searchInput").value;
    search_input = search_input.toLowerCase();

    search_results.innerHTML = '';

    for (let i = 0; i < song_dj_list.length; i++) {
        if (song_dj_list[i].hasOwnProperty('name')) {
            if (song_dj_list[i]["name"].toLowerCase().includes(search_input)) {
                const result = document.createElement("li");
                const text = document.createTextNode(song_dj_list[i]["name"]);
                result.appendChild(text);
                
                const text2 = document.createTextNode("Add");
                const btn = document.createElement("button");
                
                btn.appendChild(text2);
                
                const song = song_dj_list[i];

                btn.addEventListener("click", function() {
                    result.removeChild(btn);
                    search_results.removeChild(result);
                    

                    async function addFavSongPost() {
                        await fetch("addsongtofavorites", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ song: song })
                        })
                    }
        

                    addFavSongPost();
                }); 


            result.appendChild(btn);
            search_results.appendChild(result)
            }

            
        }

        else {
            if (song_dj_list[i]["djOwner"].toLowerCase().includes(search_input)) {
                
                const result = document.createElement("li");
                const text = document.createTextNode(song_dj_list[i]["djOwner"]);
                result.appendChild(text);
                
                const text2 = document.createTextNode("Add");
                const btn = document.createElement("button");
                
                btn.appendChild(text2);
                
                const dj = song_dj_list[i];

                btn.addEventListener("click", function() {
                    result.removeChild(btn);
                    search_results.removeChild(result);
                    

                    async function addDJPost() {
                        await fetch("djaddqueue", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ dj: dj })
                        })
                    }

                    addDJPost();
                }); 

                result.appendChild(btn);

                search_results.appendChild(result)
            }
        }
         
            

            

            
            
            

            // if (song_dj_list[i]["type"] == "dj" && search_input.length != 0) {
            //     btn.addEventListener("click", function() {
            //         result.removeChild(btn);
            //         liked_djs.appendChild(result);
            //     }); 
            // }
            
            

        }

        if (search_input == 0) {
            search_results.innerHTML = '';
        }
    }

    



const modal = document.querySelector(".modal-songs");
const modal2 = document.querySelector(".modal-djs");

const overlay = document.querySelector(".overlay-1");
const overlay2 = document.querySelector(".overlay-2");

const openModalBtn = document.querySelector(".btn-1");
const openModalBtn2 = document.querySelector(".btn-2");

const closeModalBtn = document.querySelector(".btn-close");


const closeModal = function () {
  modal.classList.add("hidden");
  modal2.classList.add("hidden");

  overlay.classList.add("hidden");
  overlay2.classList.add("hidden");
};


closeModalBtn.addEventListener("click", closeModal);


overlay.addEventListener("click", closeModal);
overlay2.addEventListener("click", closeModal);



document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && (!modal.classList.contains("hidden") || !modal2.classList.contains("hidden"))) {
    closeModal();
  }
});


const openModal = function () {

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  for (let i = 0; i < favoriteSongList["favoriteSongs"].length; i++) {
    const liElement = document.createElement("li");
    const text = document.createTextNode(favoriteSongList["favoriteSongs"][i]["name"]);
    liElement.appendChild(text);
    liked_songs.appendChild(liElement);
  }

  const likedSongList = document.querySelectorAll(".liked-songs li");


  for (let i = 0; i < likedSongList.length; i++) {
        const text = document.createTextNode("Remove");
        const btn = document.createElement("button");
            
        btn.appendChild(text);
        
        const song = favoriteSongList["favoriteSongs"][i];

        btn.addEventListener("click", function() {
            liked_songs.removeChild(likedSongList[i])
            
            async function removeFavSongPost() {
                await fetch("removefavoritesong", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ song: song })
                })
            }
            
            removeFavSongPost();
            
        }); 
        
        likedSongList[i].appendChild(btn);
  }
};


// async function fetchFavoriteSongData() {
//     const response = await fetch("/getfavoritesongs");
//     const data = await response.json();
//     return data; 
// }

// fetchFavoriteSongData().then((data) => {
//     favoriteSongList = data;
//     openModalBtn.addEventListener("click", openModal);
// })

const openModal2 = function () {

    modal2.classList.remove("hidden");
    overlay2.classList.remove("hidden");
  
    for (let i = 0; i < dj_list.length; i++) {
      const liElement = document.createElement("li");
      const text = document.createTextNode(dj_list[i]["djOwner"]);
      liElement.appendChild(text);
      liked_djs.appendChild(liElement);
    }
  
    const dj_li_List = document.querySelectorAll(".liked-djs li");

  
    for (let i = 0; i < dj_li_List.length; i++) {
          const text = document.createTextNode("Remove");
          const btn = document.createElement("button");
              
          btn.appendChild(text);
          
          const dj = dj_list[i];
  
          btn.addEventListener("click", function() {
              liked_djs.removeChild(dj_li_List[i])
              
              async function removeFavSongPost() {
                  await fetch("/removedj", {
                      method: "POST",
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ dj: dj })
                  })
              }
              
              removeFavSongPost();
              
          }); 
          
          dj_li_List[i].appendChild(btn);
    }
  };

// async function fetchDJData() {
//     const response = await fetch("/getdjs");
//     const data = await response.json();
//     return data; 
// }

// fetchDJData().then((data) => {
//     dj_list = data;
//     openModalBtn2.addEventListener("click", openModal2);
// })