const http = require('http');
const socketIo = require('socket.io');
const { getBoard, players, getCurrentPlayer, switchPlayer, updateBoard, startingGameState, printBoard, promptMove } = require('./src/gameState');
const { resetGame, checkForDraw, checkWinner } = require('./src/gameLogic');

const server = http.createServer();
const io = socketIo(server);

let gameActive = false;

io.on('connection', (socket) => {
  //for more than 2 players : 
  if (Object.keys(players).length >= 2) {
    console.log('Game is full');
    socket.emit('full', 'Game is full');
    return;
  }

  const symbol = Object.keys(players).length === 0 ? 'X' : 'O';
  players[socket.id] = symbol;
  console.log(`Player ${socket.id} assigned symbol ${symbol}`);
  socket.emit('assign', symbol);

  //starting of the Game: 
  if (!gameActive && Object.keys(players).length === 2) {
    console.log('Starting game...');
    startingGameState();
    gameActive = true;
    io.emit('updateBoard', { board: getBoard(), currentPlayer: getCurrentPlayer() });
    printBoard();
    promptMove(handleMove);
  }

  socket.on('move', ({ row, col }) => {
    if (getBoard()[row][col] === '' && players[socket.id] === getCurrentPlayer()) {
      updateBoard(row, col, players[socket.id]);
      printBoard();
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
        promptMove(handleMove);
      }
    } else {
      socket.emit('invalidMove', 'Cell is already taken or not your turn');
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    if (Object.keys(players).length === 0) {
      console.log('No players left. Resetting game...');
      resetGame();
      io.emit('reset', getBoard());
      gameActive = false;
    }
  });
});

function handleMove(row, col) {
  io.emit('move', { row, col });
}


server.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Waiting for players to connect...');
});

