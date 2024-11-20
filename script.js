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

  const mark = function (row, column, player) {
    board[row][column].mark = player.mark;
  };

  const printboard = function () {
    console.log(board);
  };

  return { getBoard, mark, printboard, board };
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

  const playRound = function (row, column) {
    console.log(`${activePlayer.name} is paying now...`);
    Gameboard.mark(row, column, activePlayer);
    collectCellsData();
    if (checkWinner()) {
      console.log(`${activePlayer.name} won the game.`);
      return;
    }
    switchPlayer();
  };

  let rightDiagonalCells = [];
  let leftDiagonalCells = [];
  let firstRowCells = [];
  let secondRowCells = [];
  let thirdRowCells = [];
  let firstColCells = [];
  let secondColCells = [];
  let thirdColCells = [];

  const collectCellsData = function () {
    rightDiagonalCells = [];
    leftDiagonalCells = [];
    firstRowCells = [];
    secondRowCells = [];
    thirdRowCells = [];
    firstColCells = [];
    secondColCells = [];
    thirdColCells = [];
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        /*   console.log("Collecting cell data..."); */
        if (row === column) leftDiagonalCells.push(board[row][column]);

        if (row === 0) firstRowCells.push(board[row][column]);

        if (row === 1) secondRowCells.push(board[row][column]);

        if (row === 2) thirdRowCells.push(board[row][column]);

        if (column === 0) firstColCells.push(board[row][column]);

        if (column === 1) secondColCells.push(board[row][column]);

        if (column === 2) {
          thirdColCells.push(board[row][column]);
        }

        if (row + column === 2) {
          rightDiagonalCells.push(board[row][column]);
        }
      }
    }
  };

  const checkTriplet = function (Cells) {
    if (Cells.every((cell) => cell.mark === "X")) return true;
    if (Cells.every((cell) => cell.mark === "O")) return true;
    else return false;
  };

  const checkWinner = function () {
    if (
      checkTriplet(rightDiagonalCells) ||
      checkTriplet(leftDiagonalCells) ||
      checkTriplet(firstColCells) ||
      checkTriplet(secondColCells) ||
      checkTriplet(thirdColCells) ||
      checkTriplet(firstRowCells) ||
      checkTriplet(secondRowCells) ||
      checkTriplet(thirdRowCells)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return {
    board,
    players,
    playRound,
    collectCellsData,
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
