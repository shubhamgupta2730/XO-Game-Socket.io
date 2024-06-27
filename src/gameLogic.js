const { getBoard, getCurrentPlayer, startingGameState } = require('./gameState');

const resetGame = () => {
  startingGameState();
};

const checkWinner = () => {
  const board = getBoard();
  const winningPositions = [
    // Rows positions : 
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    // Columns positions
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    // Diagonals positions
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  // Check each winning position
  for (const positions of winningPositions) {
    const [a, b, c] = positions;
    const [rowA, colA] = a;
    const [rowB, colB] = b;
    const [rowC, colC] = c;

    // Checking each position for(x or o)
    if (
      board[rowA][colA] &&
      board[rowA][colA] === board[rowB][colB] &&
      board[rowA][colA] === board[rowC][colC]
    ) {
      //returns either x or o winner: 
      return board[rowA][colA]; 
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
