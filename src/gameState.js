let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let players = {};
let currentPlayer = 'X';

const startingGameState = () => {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  players = {};
  currentPlayer = 'X';
};

const updateBoard = (row, col, player) => {
  board[row][col] = player;
};

const switchPlayer = () => {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const getBoard = () => board;
const getCurrentPlayer = () => currentPlayer;

const printBoard = () => {
  console.log('\nCurrent Board:');
  console.log('-------------');
  for (let i = 0; i < board.length; i++) {
    let row = '|';
    for (let j = 0; j < board[i].length; j++) {
      row += board[i][j] === '' ? ' ' : board[i][j];
      row += '|';
    }
    console.log(row);
    console.log('-------------');
  }
};

const promptMove = (callback) => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const currentPlayer = getCurrentPlayer();
  console.log(`Current player: ${currentPlayer}`);
  rl.question(`Enter cell number (1-9, starting from top-left corner): `, (input) => {
    const cellIndex = parseInt(input, 10) - 1;
    if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex > 8) {
      console.log('Invalid input. Enter a number between 1 and 9.');
      promptMove(callback);
    } else {
      const row = Math.floor(cellIndex / 3);
      const col = cellIndex % 3;
      rl.close();
      callback(row, col);
    }
  });
};

module.exports = {
  getBoard,
  getCurrentPlayer,
  switchPlayer,
  updateBoard,
  startingGameState,
  printBoard,
  promptMove,
  players,
};
