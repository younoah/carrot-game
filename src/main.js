'use strict';
import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const GAME_DURATION_SEC = 3;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;

const $gameBtn = document.querySelector('.game__button');
const $gameTimer = document.querySelector('.game__timer');
const $gameScore = document.querySelector('.game__score');

let started = false;
let score = 0;
let timer = undefined;

const gamePopUp = new PopUp();
const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gamePopUp.setClickListener(() => {
  startGame();
  gamePopUp.hide();
});
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === 'carrot') {
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (item === 'bug') {
    finishGame(false);
  }
}

$gameBtn.addEventListener('click', () => {
  started ? stopGame() : startGame();
});

function startGame() {
  started = true;
  score = 0;
  $gameScore.innerText = CARROT_COUNT;
  gameField.init();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function showStopButton() {
  const icon = $gameBtn.querySelector('.fas');
  icon.classList.add('fa-pause');
  icon.classList.remove('fa-play');
  $gameBtn.style.visibility = 'visible';
}

function showTimerAndScore() {
  $gameTimer.style.visibility = 'visible';
  $gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const sconds = time % 60;
  $gameTimer.innerText = `${minutes} : ${sconds}`;
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateScoreBoard() {
  $gameScore.innerText = CARROT_COUNT - score;
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gamePopUp.showWithText('Replay?');
  sound.playAlert();
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideGameButton();
  win ? sound.playWin() : sound.playBug();
  gamePopUp.showWithText(win ? 'YOU WIN!' : 'YOU LOST');
  sound.stopBackground();
}

function hideGameButton() {
  $gameBtn.style.visibility = 'hidden';
}
