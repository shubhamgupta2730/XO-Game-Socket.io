const readline = require('readline');

let games = {};

const startingGameState = (gameId) => {
  games[gameId] = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    players: {},
    currentPlayer: 'X',
  };
};

const updateBoard = (gameId, row, col, player) => {
  if (games[gameId]) {
    games[gameId].board[row][col] = player;
  } else {
    console.error(`Game ${gameId} does not exist.`);
  }
};

const switchPlayer = (gameId) => {
  if (games[gameId]) {
    games[gameId].currentPlayer = games[gameId].currentPlayer === 'X' ? 'O' : 'X';
  } else {
    console.error(`Game ${gameId} does not exist.`);
  }
};

const getBoard = (gameId) => {
  if (games[gameId]) {
    return games[gameId].board;
  } else {
    console.error(`Game ${gameId} does not exist.`);
    return null;
  }
};

const getCurrentPlayer = (gameId) => {
  if (games[gameId]) {
    return games[gameId].currentPlayer;
  } else {
    console.error(`Game ${gameId} does not exist.`);
    return null; 
  }
};

const printBoard = (gameId) => {
  if (games[gameId] && games[gameId].board) {
    const boardToPrint = games[gameId].board;
    console.log(`\nCurrent Board for Game ${gameId}:`);
    console.log('-------------');
    for (let i = 0; i < boardToPrint.length; i++) {
      let row = '|';
      for (let j = 0; j < boardToPrint[i].length; j++) {
        row += boardToPrint[i][j] === '' ? ' ' : boardToPrint[i][j];
        row += '|';
      }
      console.log(row);
      console.log('-------------');
    }
  } else {
    console.error(`Unable to print board for Game ${gameId}.`);
  }
};

const promptMove = (gameId, callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter your move (row and column): ', (move) => {
    const [row, col] = move.split(' ').map(Number);
    rl.close();
    callback(row, col);
  });
};

module.exports = {
  startingGameState,
  updateBoard,
  switchPlayer,
  getBoard,
  getCurrentPlayer,
  printBoard,
  promptMove,
  games 
};
