
$('h2').css('font-family', 'Roboto, sans-serif');


$('.restart').on('click', () => { startGame()})
    function startGame() {
        window.origBoard;
        window.huPlayer = "O";
        window.aiPlayer = "X";
        window.winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];
        $('.popup').css('display', 'none');
        origBoard = Array.from(Array(9).keys());
        window.cells = document.querySelectorAll('.cells');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerHTML = "";
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick, false);
        }
        function turnClick(square){
            if(typeof(origBoard[square.target.id]) === "number"){
                turn(square.target.id, huPlayer)
                if(!checkTie()) turn(bestSpot(), aiPlayer);
            }

        }
        const turn = (squareID, player) => {
            origBoard[squareID] = player;
            /*cells[squareID].innerHTML = player;*/
            //
            let curr = (player === aiPlayer ? "X" : "O");
            cells[squareID].innerHTML = `<img src="../components/${curr}.svg" style="width: 80%;height: 80%;"  alt='${curr}'/>`
            //
            let gameWon = CheckWin(origBoard, player);
            if (gameWon) {
                gameOver(gameWon)
            };



        }
        const CheckWin = (board, player) => {
            let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, [])
            let gameWon = null;
            for (let [index, win] of winCombos.entries()) {
                if (win.every(elem => plays.indexOf(elem) > -1)) {
                    gameWon = {index: index, player: player};
                    break;
                }
            }
            return gameWon;
        }
        const gameOver = (gameWon) => {
            for (let index of winCombos[gameWon.index]) {
                document.getElementById(index).style.backgroundColor =
                    gameWon.player === huPlayer ? "blue" : "red";
            }
            for (let i = 0; i < cells.length; i++) {
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose!");
            let count = 7;
            const interval = setInterval(() => {
                count--;
                $('.countdown').text("Restart after: " + count);
                if (count === 0) {
                    clearInterval(interval);
                    $('.popup').css('display', "none")
                    startGame();
                }
            }, 1000);
        }
        function emptySquares(){
            return origBoard.filter(s => typeof s  === 'number');
        }
        function declareWinner(who){
            $('.popup').css('display', 'block');
            document.querySelector(".popup .popup-content .message").innerText = who;
        }
        function checkTie() {
            if(emptySquares().length === 0){
                for(let i = 0; i < cells.length; i++) {
                    cells[i].style.backgroundColor = "green";
                    cells[i].removeEventListener('click', turnClick, false);
                    declareWinner("Tie Game");
                }
                return true;
            }
            return false;
        }
        function bestSpot(){
            return minimax(origBoard, aiPlayer).index;
        }
        function minimax(newBoard, player){
            let availSpots = emptySquares(newBoard);
            if(CheckWin(newBoard, player)) {
                return {score: -10};
            }else if(CheckWin(newBoard, aiPlayer)){
                return {score: 10}
            }else if(availSpots.length === 0){
                return {score: 0}
            };
            let moves = [];
            for (let i = 0; i < availSpots.length ; i ++){
                let move = {};
                move.index = newBoard[availSpots[i]];
                newBoard[availSpots[i]] = player;
                if (player === aiPlayer){
                    let result = minimax(newBoard, huPlayer);
                    move.score = result.score;
                }else {
                    let result = minimax(newBoard, aiPlayer);
                    move.score = result.score;
                }
                newBoard[availSpots[i]] = move.index;
                moves.push(move);
            }
            let bestMove ;
            if(player === aiPlayer){
                let bestScore = -10000;
                for (let i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }else{
                let bestScore = 10000;
                for (let i = 0; i < moves.length; i++){
                    if(moves[i].score < bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }
}
startGame()


