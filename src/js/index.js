// const content = document.querySelector('.js-content');
// // const container = document.querySelector('.js-container');

// let player = 'X';
// // let player = '';
// let historyX = [];
// let historyO = [];
// const wins = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
//   [1, 4, 7],
//   [2, 5, 8],
//   [3, 6, 9],
//   [1, 5, 9],
//   [3, 5, 7],
// ];

// function createMarkup() {
//   let markup = '';

//   for (let i = 1; i < 10; i += 1) {
//     markup += `<div class="item js-item" data-id="${i}"></div>`;
//   }
//   content.innerHTML = markup;
// }
// createMarkup();

// content.addEventListener('click', onClick);

// function onClick(event) {
//   const { target } = event;
//   const id = Number(target.dataset.id);
//   let result = false;
//   target.textContent = player;

//   console.log(player);
//   // if (!target.classList.contains('js-item') || target.textContent !== '') {
//   //   return;
//   // }
//   if (!target.classList.contains('js-item')) {
//     return;
//   }

//   if (player === 'X') {
//     historyX.push(id);
//     result = isWinner(historyX);
//   } else {
//     historyO.push(id);
//     result = isWinner(historyO);
//   }

//   // target.textContent = player;

//   if (result) {
//     console.log(`Winner ${player}`);
//     resetGame();
//     return;
//   } else if (historyX.length + historyO.length === 9) {
//     console.log('No winner');
//     resetGame();
//     return;
//   }

//   player = player === 'X' ? 'O' : 'X';
//   // if (target.textContent === '') {
//   //   player = player === 'X' ? 'O' : 'X';
//   // }
//   // target.textContent = player;
//   // if (target.textContent) {
//   //   return;
//   // }
//   // player = player === 'X' ? 'O' : 'X';
// }

// function isWinner(arr) {
//   return wins.some(item => item.every(num => arr.includes(num)));
// }

// function resetGame() {
//   createMarkup();
//   historyX = [];
//   historyO = [];
//   player = 'X';
// }

const board = document.querySelector('.js-board');
const title = document.querySelector('.js-title');
const button = document.querySelector('.js-button');
const counterTotal = document.querySelector('.js-counter-total');
const counterTextX = document.querySelector('.js-counter-x');
const counterTextO = document.querySelector('.js-counter-o');
const counterTextDraw = document.querySelector('.js-counter-draw');

let currentPlayer = 'X';
let historyX = [];
let historyO = [];
let cells = [];
let cell = '';
let gameOver = false;
let counterX = { value: 0 };
let counterO = { value: 0 };
let counterDraw = { value: 0 };

function createMarkup() {
  for (let i = 1; i < 10; i += 1) {
    cell = `<div class="cell" data-id="${i}"></div>`;

    board.insertAdjacentHTML('beforeend', cell);
  }

  cells = [...board.childNodes];
}

createMarkup();

board.addEventListener('click', onClick);

function onClick(event) {
  const { target } = event;
  const id = Number(target.dataset.id);

  if (target.textContent !== '' || gameOver) {
    return;
  }

  if (
    target.classList.contains('cell') &&
    target.textContent === '' &&
    currentPlayer === 'X' &&
    !gameOver
  ) {
    target.textContent = currentPlayer;
    historyX.push(id);
  }

  checkIsWinner();

  if (!gameOver) {
    setTimeout(makeBotMove, 500);
  }
}

function isWinner(arr) {
  const winsCombination = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  return winsCombination.some(item => item.every(num => arr.includes(num)));
}

function checkIsWinner() {
  if (isWinner(historyX)) {
    setWinner('Winner: X', counterX, counterTextX);
  } else if (isWinner(historyO)) {
    setWinner('Winner: O', counterO, counterTextO);
  } else if (historyX.length + historyO.length === 9) {
    setWinner("It's a draw. Try again!", counterDraw, counterTextDraw);
  }

  counterTotal.textContent =
    counterX.value + counterO.value + counterDraw.value;
}

function setWinner(str, counter, counterText) {
  title.textContent = str;
  counter.value += 1;
  counterText.textContent = counter.value;
  gameOver = true;
}

function makeBotMove() {
  const emptyCells = cells.filter(cell => cell.textContent === '');
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const botCell = emptyCells[randomIndex];
    botCell.textContent = 'O';
    historyO.push(Number(botCell.dataset.id));
    checkIsWinner();
  }
}

function resetGame() {
  historyX = [];
  historyO = [];
  gameOver = false;
  cell = '';
  title.textContent = 'Who will win?';
  cells.forEach(cell => {
    cell.textContent = '';
  });
}

button.addEventListener('click', onButtonClick);

function onButtonClick() {
  resetGame();
}
