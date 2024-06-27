const io = require('socket.io-client');
const { printBoard, promptMove } = require('./src/gameState');

const socket = io('http://localhost:3000');

let symbol;

socket.on('connect', () => {
  console.log('Connected to server');

  socket.on('assign', (assignedSymbol) => {
    symbol = assignedSymbol;
    console.log(`You are player ${symbol}`);
  });

  socket.on('full', (msg) => {
    console.log(msg);
    socket.disconnect();
    process.exit(1);
  });

  socket.on('updateBoard', ({ board, currentPlayer }) => {
    printBoard(board);
    console.log(`Player ${currentPlayer}'s turn`);
    if (currentPlayer === symbol) {
      promptMove((row, col) => {
        socket.emit('move', { row, col });
      });
    }
  });

  socket.on('win', (winner) => {
    console.log(`Player ${winner} wins!`);
    socket.disconnect();
    process.exit(0);
  });

  socket.on('draw', () => {
    console.log(`It's a draw!`);
    socket.disconnect();
    process.exit(0);
  });

  socket.on('reset', (board) => {
    console.log('Game reset. Waiting for players...');
    printBoard(board);
  });

  socket.on('invalidMove', (msg) => {
    console.log(msg);
    promptMove((row, col) => {
      socket.emit('move', { row, col });
    });
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  process.exit(1);
});
