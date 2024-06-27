const { games } = require('./gameState');

const resetGame = (gameId) => {
  if (games[gameId]) {
    games[gameId].board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    games[gameId].currentPlayer = 'X';
  } else {
    console.error(`Game ${gameId} does not exist.`);
  }
};

const checkWinner = (gameId) => {
  if (games[gameId]) {
    const board = games[gameId].board;
    const winningCombinations = [
      // Rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // Columns
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // Diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const combination of winningCombinations) {
      if (combination[0] !== '' && combination[0] === combination[1] && combination[1] === combination[2]) {
        return combination[0];
      }
    }
    return null;
  } else {
    console.error(`Game ${gameId} does not exist.`);
    return null;
  }
};

const checkForDraw = (gameId) => {
  if (games[gameId]) {
    const board = games[gameId].board;
    for (const row of board) {
      if (row.includes('')) {
        return false;
      }
    }
    return true;
  } else {
    console.error(`Game ${gameId} does not exist.`);
    return false;
  }
};

module.exports = {
  resetGame,
  checkWinner,
  checkForDraw,
};
