
$(document).ready(function() {
    let isEndGamePopupDisplayed = false;
    const socket = io(window.location.host);
    $(".btn-lobby-create").on("click", function() {
        let inputValue = $(".input").val();
        socket.emit("createLobby", inputValue);

    });

    $(".btn-lobby-join").on("click", function() {
        let inputValue = $(".input").val();
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

    });
    socket.on("opponentDisconnected", () =>{
        alert("The lobby is closed...Opponent is disconnected")
        isEndGamePopupDisplayed = true;
        window.location.href = '/';

    });
    socket.on('startGame', () => {
        console.log('Received startGame event');
        $('.container').css('display' , 'block');
        $('.lobby_container').css('display','none');

    })
    window.addEventListener("beforeunload", function(event) {
            event.preventDefault();
            window.location.href = "/";
    });

});
