
$(document).ready(function() {
    let isEndGamePopupDisplayed = false;
    const socket = io(window.location.host);
    $(".btn-lobby-create").on("click" ,function() {
        let inputValue = $(".input").val();
        socket.emit("createLobby", inputValue);
    });

    $(".btn-lobby-join").on("click", function() {
        let inputValue = $(this).text().split(':')[1];
        socket.emit("joinLobby", inputValue);

    });
    socket.on("id_the_same", function() {
        alert('You can\'t create a room and join the same');
        window.location.assign('/');
    })
    socket.on("lobbyFull", function() {
        alert("The lobby is already full!");
    });

    socket.on("lobbyNotFound", function() {
        alert("The lobby does not exist!");
    });

    socket.on("joinedLobby", function(data) {
        console.log("Joined lobby: " + data);
    });
    $(".btn-exit").on("click", function() {
        socket.disconnect();
        window.location.assign('/');
        isEndGamePopupDisplayed = false;
        restartGame();

    });
    socket.on("opponentDisconnected", (lobbyName) =>{
        alert("The lobby is closed...Opponent is disconnected")

        isEndGamePopupDisplayed = true;
        window.location.href = '/';

    });
    socket.on('startGame', () => {
        console.log('Received startGame event');
        $('.container').css('display' , 'block');
        $('.lobby_container').css('display','none');

    })
    socket.on('lobbyExist', (data) =>{
        alert("The lobby with name : ----- " + data + " ---- already exists");
    })
    socket.on('GameOvered', lobbyName =>{
        console.log(lobbyName);
        $("#" + lobbyName).remove();
    })
    window.addEventListener("beforeunload", function(event) {
            event.preventDefault();
            socket.disconnect();
            window.location.href = "/";
    });
    let lobbyLists = [];
    socket.on("valueOfLobby", (data) => {
        const numOfPlayers = data.num;
        const lobbyName = data.lobbyName;
        if(lobbyLists.includes(lobbyName)){
            $("#" + lobbyName + " p").text(`2/2`);
            const lobbyData = {
                numOfPlayers: numOfPlayers,
                lobbyName: lobbyName
            };
            localStorage.setItem(lobbyName, JSON.stringify(lobbyData));
        }else{
            lobbyLists.push(lobbyName);
            let new_lobby = document.createElement('div');
            let div_parent = document.querySelector('.scroll-container');
            new_lobby.setAttribute("class", "scroll-page");
            new_lobby.innerHTML = `Lobby Name: <h5 class="${lobbyName}">${lobbyName}</h5>   <p id=lobbyName>${numOfPlayers}/2</p> <button class="btn-join-lobby" style="margin-left: 15px;margin-bottom: 0;width: 100px;height: 35px; display: inline-block">Join</button> `;
            new_lobby.setAttribute('id' , lobbyName);
            /*new_lobby.appendChild(buttonJoin);*/

            div_parent.addEventListener('click', (event) => {
                if (event.target.classList.contains('btn-join-lobby')) {
                    let inputValue = $('.' + lobbyName).text();
                    console.log(inputValue);
                    socket.emit("joinLobby", inputValue);
                }
            });

            div_parent.appendChild(new_lobby);

            const lobbyData = {
                numOfPlayers: numOfPlayers,
                lobbyName: lobbyName
            };
            localStorage.setItem(lobbyName, JSON.stringify(lobbyData));
        }
    });

});
