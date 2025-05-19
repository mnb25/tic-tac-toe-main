const boardModule = (() => {
  const mainButton = document.querySelector("#main-button");
  const displayBoard = document.querySelector("#board");

  function setupBoard(board, player) {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {

        const span = document.createElement("span");
        span.setAttribute("role", "button");
        span.setAttribute("tabindex", "0");
        displayBoard.appendChild(span);

        span.addEventListener("keypress", (event) => {
          if (event.key === "Enter" || "Space") span.click();
        });

        span.addEventListener("click", () => {
          if (board[rowIndex][colIndex] !== "") {
            return;
          }

          board[rowIndex][colIndex] = player;
          span.textContent = board[rowIndex][colIndex];

          if (gameModule.checkWin(player)) {
            resetRound(board, player);
            mainButton.textContent = player + " wins! Continue?";
          } else if (gameModule.checkDraw()) {
            resetRound(board, player);
            mainButton.textContent = "It's a draw. Continue?";
          } else {
            span.style.pointerEvents = "none";
            player = player === "X" ? "O" : "X";
            mainButton.textContent = player + "'s turn";
          }
        });
      });
    });
  }

  function resetRound(board, player) {
    mainButton.addEventListener("click", resetBoard.bind(null, board, player));
    mainButton.style.pointerEvents = "auto";
    mainButton.style.boxShadow = "0 0 1rem #3333";

    player = player === "X" ? "O" : "X";

    displayBoard.style.pointerEvents = "none";
    displayBoard.style.opacity = "0.5";
  }

  function resetBoard(board, player) {
    mainButton.removeEventListener("click", resetBoard.bind(null, board, player));
    mainButton.style.pointerEvents = "none";
    mainButton.style.boxShadow = "none";
    mainButton.textContent = player + "'s turn";

    displayBoard.innerHTML = "";
    displayBoard.style.opacity = "initial";
    displayBoard.style.pointerEvents = "auto";

    board.forEach((row) => row.fill(""));
    setupBoard(board, player);
  }

  return { resetBoard };
})();

const gameModule = (() => {
  let player = "X";
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function checkWin(player) {
    // check rows
    for (let row of board) {
      if (row.every((cell) => cell === player)) {
        return true;
      }
    }

    // check columns
    for (let i = 0; i < board.length; i++) {
      if (board.every((row) => row[i] === player)) {
        return true;
      }
    }

    // Check diagonals for a win
    if (
      // .every() conveniently increases the index at the same time as the row, resulting in an X shape check
      board.every((row, index) => row[index] === player) ||
      board.every((row, index) => row[board.length - 1 - index] === player)
    ) {
      return true;
    }

    return false;
  }

  function checkDraw() {
    return board.every((row) => row.every((cell) => cell !== ""));
  }

  boardModule.resetBoard(board, player); // initialize the game

  return { checkWin, checkDraw };
})();