const socket = io(window.location.host); // http://tictactoe.vercel.app
const winningCombinations = [
    ['0', '1', '2'], // Top row
    ['3', '4', '5'], // Middle row
    ['6', '7', '8'], // Bottom row

    ['0', '3', '6'], // Left column
    ['1', '4', '7'], //Middle column
    ['2', '5', '8'], // Right column

    ['0', '4', '8'], // Diagonal from top-left to bottom-right
    ['2','4', '6'], // Diagonal from top-right to bottom-left
];
let CurrentPlayer = "O";
let arrX = [];
let arrO = [];
let sock = [];
let sockId = null;
$(document).ready(function() {
    $('button.Multiplayer').on('click',function(){
        $('.container').css('display' , 'block') ;
        $('td').click(doClick);
    });
});
function doClick() {
    if ($(this).find('img').length !== 0) {
        // Cell already has an image, do nothing
        return;
    }
    if(sock.length < 2){
        if(!sock.includes(socket.id)){
            sockId = socket.id;
        }else{
            return;
        }
    }
    if(sock.length === 2){
        if(sock[0] === socket.id && CurrentPlayer === "X"){
            return;
        }else if(sock[1] === socket.id  && CurrentPlayer === "O"){
            return;
        }
    }
    //Change "X" to X svg img  and also with "O"
    $(this).html(`<img src="../components/${CurrentPlayer}.svg" style="width: 80%;height: 80%;" alt="${CurrentPlayer}"/>`);
    let cellId = $(this).attr('id');
    let valueId = $('#' + cellId + ' img').attr('alt')
    CurrentPlayer = CurrentPlayer === "O" ? "X" : "O";

    if (valueId === 'X') {
        arrX.push(cellId);
    } else {
        arrO.push(cellId);
    }
    $("#h2").text(CurrentPlayer + " is now walking");
    //Checking for winning combinations
    if (arrX.length >= 3 || arrO.length >= 3) {
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (arrX.includes(a) && arrX.includes(b) && arrX.includes(c)) {
                $('td').off('click');
                $("#h2").text("X" + " is won!!");
                let msg = "X" + " is won!!";
                socket.emit('gameOver' ,{
                    msg : msg,
                });
                showPopup("X");
                let count = 6;
                const interval = setInterval(() => {
                    count--;
                    $('.countdown').text("Restart after: " + count);
                    if (count === 0) {
                        clearInterval(interval);
                        $('.popup').css('display', "none")
                        $('td').empty().click(doClick);
                        restartGame('');
                        CurrentPlayer = "O";
                    }
                }, 1000);
            } else if (arrO.includes(a) && arrO.includes(b) && arrO.includes(c)) {
                $('td').off('click');
                $("#h2").text("O" + " is won!!");
                let msg = "O" + " is won!!";

                socket.emit('gameOver' , {
                    msg : msg,
                })
                showPopup("O");
                let count = 6;
                const interval = setInterval(() => {
                    count--;
                    $('.countdown').text("Restart after: " + count);
                    if (count === 0) {
                        clearInterval(interval);
                        $('.popup').css('display', "none")
                        $('td').empty().click(doClick);
                        restartGame('');
                        CurrentPlayer = "O";
                    }
                }, 1000);
            }    //Checking for non-empty cells,if not call a draw
            else if(arrX.length === 5 || arrO.length === 5 ){
                let msg = "Draw !";
                socket.emit('gameOver', {
                    msg : msg,
                });
                showPopup("Draw !");
                $('td').off('click');
            }

        }
    }
    // send a message to the server
    socket.emit('move',{
            socks: sockId,
            index: cellId,
            player: CurrentPlayer,
            currentPlayer: CurrentPlayer // send the current player value to the server
        }
    );
}
// receive a message from the server
socket.on('move', (data) => {
    const {index, player, currentPlayer,socks} = data;
    if(sock.length < 2) {
        sock.push(socks);
    }
    $('#' + index).html(`<img src="../components/${player}.svg" style="width: 80%;height: 80%;" alt="${player}"/>`);
    // update the current player value based on the value received from the server
    CurrentPlayer = currentPlayer;
    let who = CurrentPlayer === "O" ? "O" : "X";
    $("#h2").text(who + " is turn");
});
socket.on('gameOver', msg => {
    showPopup(msg);
    let count = 6;
    const interval = setInterval(() => {
        count--;
        $('.countdown').text("Restart after: " + count);
        if (count === 0) {
            clearInterval(interval);
            sock = [];
            $('.popup').css('display', "none")
            $('td').empty().click(doClick);
            restartGame('');
            CurrentPlayer = "O";
        }
    }, 1000);
})

function restartGame() {
    // Reset CurrentPlayer to "X"
    arrX = [];
    arrO = [];
    $('td').empty().click(doClick); // Clear the board and reattach click event handler
    $("#h2").text("O" + "  is turn");

}
