const GameBoard = function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const markCell = function (row, column, player) {
    board[row][column].mark = player.mark;
  };

  const printboard = function () {
    console.log(board);
  };

  return { getBoard, markCell, printboard, board };
};

///Cell
const Cell = function () {
  let mark = "";

  const getMark = () => mark;

  return { mark, getMark };
};

///GameController
const GameController = function () {
  const Gameboard = GameBoard();
  const board = Gameboard.board;
  const players = [
    {
      name: "player1",
      mark: "X",
      score: 0,
    },
    {
      name: "player2",
      mark: "O",
      score: 0,
    },
  ];

  let activePlayer = players[0];

  //Switch Player
  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  //Playing a round
  const playRound = function (row, column) {
    console.log(`${activePlayer.name} is paying now...`);
    Gameboard.markCell(row, column, activePlayer);
    /* collectCellsData(); */
    if (checkWinner()) {
      console.log(`${activePlayer.name} won the game.`);
      return;
    }
    switchPlayer();
  };

  //const getRow = (row) => board[row]; ::: this is not use cause for the row we can simply use board array
  const getColumn = (col) => board.map((row) => row[col]);
  const getLeftDiagonal = () => board.map((row, i) => row[i]);
  const getRightDiagonal = () =>
    board.map((row, i) => row[board.length - 1 - i]);

  const checkTriplet = function (Cells) {
    if (Cells.every((cell) => cell.mark === "X")) return true;
    if (Cells.every((cell) => cell.mark === "O")) return true;
    else return false;
  };

  const getWinningCombination = () => [
    ...board,
    [0, 1, 2].map(getColumn),
    getLeftDiagonal(),
    getRightDiagonal(),
  ];

  const checkWinner = function () {
    return getWinningCombination().some(checkTriplet);
  };

  return {
    board,
    players,
    playRound,

    checkWinner,
    checkTriplet,
  };
};

const game = GameController();

game.playRound(1, 1);
game.playRound(1, 2);
game.playRound(2, 2);
game.playRound(0, 2);
game.playRound(0, 0);
