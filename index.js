const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { getBoard, players, getCurrentPlayer, switchPlayer, updateBoard, startingGameState } = require('./src/gameState');
const { resetGame, checkForDraw, checkWinner } = require('./src/gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));


io.on('connection', (socket) => {
  if (Object.keys(players).length >= 2) {

    socket.emit('full', 'Game is full');
    return;
  }

  const symbol = Object.keys(players).length === 0 ? 'X' : 'O';
  players[socket.id] = symbol;
  socket.emit('assign', symbol);


  // Emitting  the  board state to the new player
  socket.emit('updateBoard', { board: getBoard(), currentPlayer: getCurrentPlayer() });

  socket.on('move', ({ row, col }) => {
    if (getBoard()[row][col] === '' && players[socket.id] === getCurrentPlayer()) {
      updateBoard(row, col, players[socket.id]);
      const winner = checkWinner();
      if (winner) {
        io.emit('win', winner);
        resetGame();
        io.emit('reset', getBoard());
      } else if (checkForDraw()) {
        io.emit('draw');
        resetGame();
        io.emit('reset', getBoard());
      } else {
        switchPlayer();
        io.emit('updateBoard', { board: getBoard(), currentPlayer: getCurrentPlayer() });
      }
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    if (Object.keys(players).length === 0) {
      resetGame();
    }
    io.emit('reset', getBoard());
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
