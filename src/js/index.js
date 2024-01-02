const moveUrl = require('url:../sounds/move.mp3');
const winnerUrl = require('url:../sounds/success.mp3');
const loserUrl = require('url:../sounds/loser.mp3');
const drawUrl = require('url:../sounds/draw.mp3');

const board = document.querySelector('.js-board');
const title = document.querySelector('.js-title');
const button = document.querySelector('.js-button');
const counterTotal = document.querySelector('.js-counter-total');
const counterTextX = document.querySelector('.js-counter-x');
const counterTextO = document.querySelector('.js-counter-o');
const counterTextDraw = document.querySelector('.js-counter-draw');
// const timeX = document.querySelector('.time-x');
// // const timeO = document.querySelector('.time-o');
// // const timeDraw = document.querySelector('.time-draw');

const checkbox = document.querySelector('.checkbox');

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

const moveSound = new Audio(moveUrl);
const winnerSound = new Audio(winnerUrl);
const loserSound = new Audio(loserUrl);
const drawSound = new Audio(drawUrl);

let isActiveSound = true;
let currentPlayer = 'X';
let historyX = [];
let historyO = [];
let cells = [];
let cell = '';
let gameOver = false;

const counterX = { value: 0 };
const counterO = { value: 0 };
const counterDraw = { value: 0 };

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
    checkIsActiveSound(moveSound);
  }

  checkIsWinner();
  paintWinner(historyX);

  if (!gameOver) {
    setTimeout(makeBotMove, 500);
  }
}

function checkIsActiveSound(sound) {
  isActiveSound ? sound.play() : sound.pause();
}

function isWinner(arr) {
  return winsCombination.some(item => item.every(num => arr.includes(num)));
}

function paintWinner(history) {
  for (const arr of winsCombination) {
    const isWinningCombo = arr.every(num => history.includes(num));
    if (isWinningCombo) {
      for (const num of arr) {
        const winningCell = cells.find(cell => Number(cell.dataset.id) === num);
        winningCell.classList.add('winning-cell');
      }
      break;
    }
  }
}

function checkIsWinner() {
  if (isWinner(historyX)) {
    setWinner('Winner: X', counterX, counterTextX);
    checkIsActiveSound(winnerSound);
  } else if (isWinner(historyO)) {
    setWinner('Winner: O', counterO, counterTextO);
    checkIsActiveSound(loserSound);
  } else if (historyX.length + historyO.length === 9) {
    setWinner("It's a draw. Try again!", counterDraw, counterTextDraw);
    checkIsActiveSound(drawSound);
  }

  setTotalGames();
}

function setTotalGames() {
  counterTotal.textContent =
    counterX.value + counterO.value + counterDraw.value;
}

// function setWinner(str, counter, counterText, timeText) {
//   title.textContent = str;
//   counter.value += 1;
//   counterText.textContent = counter.value;
//   timeText.textContent = setWordTime(counter);
//   gameOver = true;
// }

function setWinner(str, counter, counterText) {
  title.textContent = str;
  counter.value += 1;
  counterText.textContent = `${counter.value} ${setWordTime(counter)}.`;
  gameOver = true;
}

function setWordTime(counter) {
  if (counter.value === 1) {
    return 'time';
  } else {
    return 'times';
  }
}

function makeBotMove() {
  const emptyCells = cells.filter(cell => cell.textContent === '');
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const botCell = emptyCells[randomIndex];
    botCell.textContent = 'O';
    historyO.push(Number(botCell.dataset.id));
    checkIsWinner();
    paintWinner(historyO);
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
    cell.classList.remove('winning-cell');
  });
}

button.addEventListener('click', onButtonClick);

function onButtonClick() {
  resetGame();
}

checkbox.addEventListener('change', onChangeCheckbox);

function onChangeCheckbox() {
  if (checkbox.checked) {
    isActiveSound = false;
  } else {
    isActiveSound = true;
  }
}
