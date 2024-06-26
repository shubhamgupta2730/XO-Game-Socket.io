const { getBoard, getCurrentPlayer, startingGameState } = require('./gameState');

const resetGame = () => {
  startingGameState();
};

const checkWinner = () => {
  const board = getBoard();
  const winningPositions = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const positions of winningPositions) {
    const [a, b, c] = positions;
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return board[a[0]][a[1]];
    }
  }
  return null;
};

const checkForDraw = () => {
  const board = getBoard();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === '') {
        return false;
      }
    }
  }
  return true;
};

module.exports = {
  resetGame,
  checkForDraw,
  checkWinner,
};
