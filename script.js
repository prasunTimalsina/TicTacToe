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
    if (board[row][column].getMark() === " ")
      board[row][column].setMark(player.mark);
  };

  const getBoard = () => board;
  const printboard = function () {
    console.log(board);
  };

  const resetBoard = function () {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  return { getBoard, markCell, printboard, resetBoard };
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

  let drawScore = 0;
  const getDrawScore = () => drawScore;
  const setDrawScore = (value) => {
    drawScore = value;
  };

  let activePlayer = players[0];

  let gameRound = 1;
  const getGameRound = () => gameRound;
  const setGameRound = (value) => {
    gameRound = value;
  };

  //Switch Player
  const switchPlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getactivePlayer = () => activePlayer;

  //Playing a round
  const playRound = function (row, column) {
    console.log(`Playing round is ${gameRound}`);
    GameBoard.markCell(row, column, activePlayer);
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

  const checkRoundWinner = function () {
    return getWinningCombination().some(checkTriplet);
  };

  //checking draw
  const checkDraw = function () {
    if (
      GameBoard.getBoard()
        .flat()
        .every((cellEl) => !(cellEl.getMark() === " "))
    ) {
      if (!checkRoundWinner()) return true;
    } else false;
  };

  const checkWinner = function () {
    if (players[0].score === players[1].score) {
      return false;
    } else {
      return true;
    }
  };

  const resetGame = function () {
    GameBoard.resetBoard();
    players.forEach((player) => {
      player.score = 0;
    });
    drawScore = 0;
    activePlayer = players[0];
    gameRound = 1;
  };

  return {
    getPlayers,
    getDrawScore,
    setDrawScore,
    playRound,
    getactivePlayer,
    checkRoundWinner,
    checkDraw,
    switchPlayer,
    getGameRound,
    setGameRound,
    checkWinner,
    resetGame,
  };
})();

//////////////Renderer/////////////////////
const Renderer = function () {
  const menuBtn = document.querySelector(".menu-btn");
  const closeMenuBtn = document.querySelector(".close-btn");
  const playerXScore = document.querySelector(".p-x-score");
  const playerOScore = document.querySelector(".p-o-score");
  const drawScore = document.querySelector(".p-draw-score");
  const boardUI = document.querySelector(".board");

  const modal = document.querySelector(".modal");
  const result = document.querySelector(".results");
  const newGameBtn = document.querySelector(".new-game-btn");
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

  //RenderScore
  const renderScore = function () {
    playerXScore.textContent = GameController.getPlayers()[0].score;
    playerOScore.textContent = GameController.getPlayers()[1].score;
    console.log(`Draw score ${GameController.getDrawScore()}`);
    drawScore.textContent = GameController.getDrawScore();
  };
  renderScore();
  //Render board
  const renderBoard = function () {
    const board = GameBoard.getBoard();

    boardUI.textContent = "";
    let html;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        html = `<div class="cell" data-row="${i}" data-column="${j}"></div>`;

        boardUI.insertAdjacentHTML("beforeend", html);
      }
    }
  };
  renderBoard();

  //clickSound
  const soundClick = function () {
    const click = new Audio("sounds/click.wav");
    click.currentTime = 0.001;

    click.play();
  };

  //Main Game
  globalEventListener(
    "click",
    ".cell",
    (e) => {
      if (GameController.getGameRound() <= 5) {
        soundClick();
        let row = e.target.dataset.row;
        let column = e.target.dataset.column;
        GameController.playRound(row, column);
        const board = GameBoard.getBoard();
        e.target.textContent = board[row][column].getMark();
        if (GameController.checkRoundWinner()) {
          console.log(`${GameController.getactivePlayer().name} won the game`);
          GameController.getactivePlayer().score += 1;
          GameController.setGameRound(GameController.getGameRound() + 1);
          setTimeout(() => {
            GameBoard.resetBoard();
            renderBoard();
          }, 50);
        } else {
          GameController.switchPlayer();
        }
        if (GameController.checkDraw()) {
          GameController.setDrawScore(GameController.getDrawScore() + 1);
          GameController.setGameRound(GameController.getGameRound() + 1);
          setTimeout(() => {
            GameBoard.resetBoard();
            renderBoard();
          }, 500);
        }
        renderScore();
      }
      if (GameController.getGameRound() > 5) {
        showResultsWithMenu();
      }
    },
    boardUI
  );

  //Show menu
  const showMenu = () => {
    modal.classList.remove("hidden");
  };

  //Hide menu
  const hideMenu = () => {
    modal.classList.add("hidden");
  };

  //show results with menu
  const showResultsWithMenu = function () {
    showMenu();
    result.style.display = "flex";
    closeMenuBtn.classList.add("hidden");
    result.textContent = `${
      GameController.checkWinner()
        ? (GameController.getPlayers()[0].score >
          GameController.getPlayers()[1].score
            ? "PlayerX"
            : "PlayerO") + " won the game 🎉"
        : "Game was draw 😔"
    }`;
  };

  //Hide results

  //Reset UI
  const ResetUI = function () {
    GameController.resetGame();
    renderScore();
    renderBoard();
    hideMenu();
    closeMenuBtn.classList.remove("hidden");
    result.textContent = "";
    result.style.display = "none";
  };

  //menu interaction
  menuBtn.addEventListener("click", showMenu);
  closeMenuBtn.addEventListener("click", hideMenu);
  newGameBtn.addEventListener("click", ResetUI);

  return { renderBoard, renderScore };
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
