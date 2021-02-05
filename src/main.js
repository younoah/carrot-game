'use strict';

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const winSound = new Audio('./sound/game_win.mp3');
const bgSound = new Audio('./sound/bg.mp3');

const CARROT_SIZE = 80;
const CARROT_COUNT = 3;
const BUG_COUNT = 20;
const GAME_DURATION_SEC = 3;

const $field = document.querySelector('.game__field');
const $fieldRect = $field.getBoundingClientRect();
const $gameBtn = document.querySelector('.game__button');
const $gameTimer = document.querySelector('.game__timer');
const $gameScore = document.querySelector('.game__score');
const $popUp = document.querySelector('.pop-up');
const $popUpText = document.querySelector('.pop-up__message');
const $popUpRefresh = document.querySelector('.pop-up__refresh');

let started = false;
let score = 0;
let timer = undefined;

$field.addEventListener('click', onFieldClick);
$gameBtn.addEventListener('click', () => {
  started ? stopGame() : startGame();
});
$popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  score = 0;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
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
  showPopUpWithText('Replay?');
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText(win ? 'YOU WIN!' : 'YOU LOST');
  playSound(bugSound);
  stopSound(bgSound);
}

function hideGameButton() {
  $gameBtn.style.visibility = 'hidden';
}

function showPopUpWithText(text) {
  $popUpText.innerText = text;
  $popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  $popUp.classList.add('pop-up--hide');
}

function initGame() {
  $field.innerHTML = '';
  $gameScore.innerHTML = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      playSound(winSound);
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    target.remove();
    playSound(bugSound);
    finishGame(false);
  }
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = $fieldRect.width - CARROT_SIZE;
  const y2 = $fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    $field.append(item);
  }
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
