///Cell
const Cell = function () {
  let mark = " ";

  const getMark = () => mark;
  const setMark = (value) => {
    mark = value;
  };

  return { getMark, setMark };
};

//Gameboard
const GameBoard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const markCell = function (row, column, player) {
    board[row][column].setMark(player.mark);
  };

  const getBoard = () => board;
  const printboard = function () {
    console.log(board);
  };

  return { getBoard, markCell, printboard };
})();

///GameController
const GameController = (function () {
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
  const getPlayers = () => players;

  let activePlayer = players[0];

  //Switch Player
  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getactivePlayer = () => activePlayer;

  //Playing a round
  const playRound = function (row, column) {
    console.log(`${activePlayer.name} is paying now...`);
    GameBoard.markCell(row, column, activePlayer);

    if (checkWinner()) {
      console.log(`${activePlayer.name} won the game.`);
      return;
    }
    switchPlayer();
  };

  //const getRow = (row) => board[row]; ::: this is not use cause for the row we can simply use board array
  const getColumn = (col) => GameBoard.getBoard().map((row) => row[col]);
  const getLeftDiagonal = () => GameBoard.getBoard().map((row, i) => row[i]);
  const getRightDiagonal = () =>
    GameBoard.getBoard().map(
      (row, i) => row[GameBoard.getBoard().length - 1 - i]
    );

  const checkTriplet = function (cells) {
    if (cells.every((cell) => cell.getMark() === "X")) return true;
    if (cells.every((cell) => cell.getMark() === "O")) return true;
    else return false;
  };

  const getWinningCombination = () => {
    const rows = GameBoard.getBoard();
    const columns = [0, 1, 2].map(getColumn);
    const diagonals = [getLeftDiagonal(), getRightDiagonal()];
    return [...rows, ...columns, ...diagonals];
  };

  const checkWinner = function () {
    return getWinningCombination().some(checkTriplet);
  };

  return {
    getPlayers,
    playRound,
    getactivePlayer,
    checkWinner,
    switchPlayer,
  };
})();

//Renderer
const Renderer = function () {
  const playerXScore = document.querySelector(".p-x");
  const playerOScore = document.querySelector(".p-o");
  const drawScore = document.querySelector(".p-draw");
  const boardUI = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");

  //Global addEventListener
  const globalEventListener = function (
    type,
    selector,
    callback,
    parent = document
  ) {
    parent.addEventListener(type, (e) => {
      if (e.target.matches(selector)) {
        callback(e);
      }
    });
  };

  //Render board
  const RenderBoard = function () {
    const board = GameBoard.getBoard();

    boardUI.textContent = "";
    let html;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        html = `<div class="cell" data-row="${i}" data-column="${j}">${board[i][
          j
        ].getMark()}</div>`;

        boardUI.insertAdjacentHTML("beforeend", html);
      }
    }
  };
  RenderBoard();

  //Populate board
  globalEventListener(
    "click",
    ".cell",
    (e) => {
      let row = e.target.dataset.row;
      let column = e.target.dataset.column;
      GameController.playRound(row, column);

      RenderBoard();
    },
    boardUI
  );
};
/* GameController.playRound(0, 0);
GameController.playRound(0, 1);
GameController.playRound(1, 1);
GameController.playRound(0, 2);
GameController.playRound(2, 2);
/* GameController.playRound(1, 0);
GameController.playRound(1, 2);
GameController.playRound(2, 0);
GameController.playRound(2, 1);
GameBoard.printboard(); */

Renderer();
