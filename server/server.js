const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, '../client')));

let lobbies = {};

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'../client','index.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});
io.on('connection', (socket) => {
    socket.on('createLobby', (lobbyName) => {
        if (!lobbies[lobbyName]) {
            lobbies[lobbyName] = [socket.id];
            socket.emit('joinedLobby', lobbyName);

        } else {
            socket.emit('lobbyFull');
        }
    });
    // When a player clicks on the game board, send the event to the other player
    socket.on('joinLobby', (lobbyName) => {
        if (lobbies[lobbyName] && lobbies[lobbyName].length < 2) {
            lobbies[lobbyName].push(socket.id);
            socket.join(lobbyName);
            socket.emit('joinedLobby', lobbyName);
            if (lobbies[lobbyName].length === 2) {
                const hashTable = {};
                for (let i = 0; i < lobbies[lobbyName].length; i++) {
                    if (hashTable[lobbies[lobbyName][i]]) {
                        socket.emit('id_the_same');
                        io.to(lobbyName).socketsLeave(lobbyName);
                    } else {
                        hashTable[lobbies[lobbyName][i]] = true;
                    }
                }

                console.log(`Starting game in lobby ${lobbyName}`);
                io.to(lobbies[lobbyName][0]).emit('startGame');
                io.to(lobbies[lobbyName][1]).emit('startGame');
            }
        } else if (lobbies[lobbyName] && lobbies[lobbyName].length >= 2) {
            socket.emit('lobbyFull');
        } else {
            socket.emit('lobbyNotFound');
        }
    });

    socket.on('move', (data) => {
        const index = data.index;
        const player = data.player === "X" ? "O" : "X";
        const currentPlayer = data.currentPlayer; // get the current player value from the client
        const socks = data.socks;
        console.log("This is current player move: ", player);
        io.emit('move', {index, player, currentPlayer,socks}); // send the current player value back to the client
    });
    socket.on('gameOver', (data)  => {
        let msg = data.msg;
        io.emit('gameOver', msg);
    });

    socket.on('disconnect', () => {
        for (const [lobbyName, players] of Object.entries(lobbies)) {
            const playerIndex = players.indexOf(socket.id);
            if (playerIndex !== -1) {
                players.splice(playerIndex, 1);
                if (players.length === 1) {
                    socket.to(players[0]).emit('opponentDisconnected');
                    delete lobbies[lobbyName];
                }
                break;
            }
        }
    })
});
