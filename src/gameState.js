let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

let players = {};

let currentPlayer = 'X';

const startingGameState = () => {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  players = {};
  currentPlayer = 'X';
};

const updateBoard = (row, col, player) => {
  board[row][col] = player;
}

const switchPlayer = () => {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

const getBoard = () => board;
const getCurrentPlayer = () => currentPlayer;

module.exports = {
  getBoard,
  players,
  getCurrentPlayer,
  switchPlayer,
  updateBoard,
  startingGameState
}
