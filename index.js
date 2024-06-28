// server.js

const http = require('http');
const socketIo = require('socket.io');
const {
  startingGameState,
  updateBoard,
  switchPlayer,
  getBoard,
  getCurrentPlayer,
  printBoard,
  games,
} = require('./src/gameState');
const { resetGame, checkForDraw, checkWinner } = require('./src/gameLogic');

const server = http.createServer();
const io = socketIo(server);

let nextGameId = 1;

io.on('connection', (socket) => {
  socket.on('joinGame', () => {
    let gameId;

    // Find an existing game or create a new one
    for (const id in games) {
      if (Object.keys(games[id].players).length < 2) {
        gameId = id;
        break;
      }
    }

    if (!gameId) {
      gameId = nextGameId.toString();
      nextGameId++;
      startingGameState(gameId);
    }

    const game = games[gameId];
    const symbol = Object.keys(game.players).length === 0 ? 'X' : 'O';
    game.players[socket.id] = symbol;
    socket.join(gameId);
    console.log(`Player ${socket.id} assigned symbol ${symbol} in game ${gameId}`);
    socket.emit('assign', { symbol, gameId });

    if (!game.gameActive && Object.keys(game.players).length === 2) {
      console.log(`Starting game ${gameId}...`);
      game.gameActive = true;
      io.to(gameId).emit('updateBoard', { gameId, board: game.board, currentPlayer: game.currentPlayer });
      printBoard(gameId);
    }
  });

  socket.on('move', ({ gameId, row, col }) => {
    const game = games[gameId];

    if (!game) {
      console.error(`Game ${gameId} does not exist.`);
      return;
    }

    const currentPlayer = game.currentPlayer;

    if (game.board[row][col] !== '' || game.players[socket.id] !== currentPlayer) {
      socket.emit('invalidMove', 'Cell is already taken or not your turn');
      return;
    }

    console.log(`Player ${currentPlayer} is making a move at row ${row}, column ${col}`);
    updateBoard(gameId, row, col, currentPlayer);
    printBoard(gameId);

    const winner = checkWinner(gameId);
    if (winner) {
      console.log(`Player ${winner} wins!`);
      io.to(gameId).emit('win', winner, games[gameId].board);
      resetGame(gameId);
      io.to(gameId).emit('reset', { gameId, board: getBoard(gameId) });
    } else if (checkForDraw(gameId)) {
      console.log("It's a draw!");
      io.to(gameId).emit('draw', games[gameId].board);
      resetGame(gameId);
      io.to(gameId).emit('reset', { gameId, board: getBoard(gameId) });
    } else {
      const updatedCurrentPlayer = switchPlayer(gameId);
      io.to(gameId).emit('updateBoard', { gameId, board: game.board, currentPlayer: updatedCurrentPlayer });
    }
  });

  socket.on('disconnect', () => {
    for (const gameId in games) {
      if (games[gameId].players[socket.id]) {
        delete games[gameId].players[socket.id];
        if (Object.keys(games[gameId].players).length === 0) {
          console.log(`No players left in game ${gameId}. Resetting game...`);
          resetGame(gameId);
          io.to(gameId).emit('reset', { gameId, board: getBoard(gameId) });
          games[gameId].gameActive = false;
          delete games[gameId];
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Waiting for players to connect...');
});
