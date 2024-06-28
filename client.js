// client.js

const io = require('socket.io-client');
const readline = require('readline');

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

  socket.on('updateBoard', ({ board, currentPlayer }) => {
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
      promptMove();
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

  socket.on('reset', ({ board }) => {
    console.log('Game reset. Waiting for players...');
    printBoard(board);
  });

  socket.on('invalidMove', (msg) => {
    console.log(msg);
    promptMove();
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  process.exit(1);
});

const promptMove = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter your move (row and column): ', (move) => {
    const [row, col] = move.split(' ').map(Number);
    rl.close();
    console.log(`Received move from player: row ${row}, column ${col}`);
    socket.emit('move', { gameId, row, col });
  });
};

const printBoard = (board) => {
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
};
