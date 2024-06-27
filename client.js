const io = require('socket.io-client');
const readline = require('readline');
const { printBoard, promptMove, getCurrentPlayer } = require('./src/gameState');

const socket = io('http://localhost:3000');

let symbol;
let gameId;

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('joinGame'); 
  socket.on('assign', ({ symbol: assignedSymbol, gameId: assignedGameId }) => {
    symbol = assignedSymbol;
    gameId = assignedGameId;
    console.log(`You are player ${symbol}`);
  });

  socket.on('full', (msg) => {
    console.log(msg);
    socket.disconnect();
    process.exit(1);
  });

  socket.on('updateBoard', ({ gameId, board, currentPlayer }) => {
    console.log(`Player ${currentPlayer}'s turn`);
    
    
    let boardString = '\n';
    boardString += '-------------';
    for (let row = 0; row < board.length; row++) {
      let rowString = '|';
      for (let col = 0; col < board[row].length; col++) {
        rowString += board[row][col] === '' ? ' ' : board[row][col];
        rowString += '|';
      }
      boardString += '\n' + rowString + '\n-------------';
    }
    console.log(boardString);
    
    if (currentPlayer === symbol) {
      promptMove(gameId, (row, col) => {
        socket.emit('move', { gameId, row, col });
      });
    }
  });

  socket.on('win', (winner) => {
    console.log(`Player ${winner} wins!`);
    socket.disconnect();
    process.exit(0);
  });

  socket.on('draw', () => {
    console.log("It's a draw!");
    socket.disconnect();
    process.exit(0);
  });

  socket.on('reset', ({ gameId, board }) => {
    console.log('Game reset. Waiting for players...');
    printBoard(gameId);
  });

  socket.on('invalidMove', (msg) => {
    console.log(msg);
    promptMove(gameId, (row, col) => {
      socket.emit('move', { gameId, row, col });
    });
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  process.exit(1);
});
