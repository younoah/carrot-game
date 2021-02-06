'use strict';

import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(carrotCount) {
    this.carrotCount = carrotCount;
    return this;
  }

  bugCount(bugCount) {
    this.bugCount = bugCount;
    return this;
  }

  build() {
    return new Game(this.gameDuration, this.carrotCount, this.bugCount);
  }
}
class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.$gameTimer = document.querySelector('.game__timer');
    this.$gameScore = document.querySelector('.game__score');
    this.$gameBtn = document.querySelector('.game__button');
    this.$gameBtn.addEventListener('click', () => {
      this.started ? this.stop(Reason.cancel) : this.start();
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  onItemClick = item => {
    if (!this.started) return;
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.stopTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  initGame() {
    this.score = 0;
    this.$gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  showStopButton() {
    const icon = this.$gameBtn.querySelector('.fas');
    icon.classList.add('fa-pause');
    icon.classList.remove('fa-play');
    this.$gameBtn.style.visibility = 'visible';
  }

  showTimerAndScore() {
    this.$gameTimer.style.visibility = 'visible';
    this.$gameScore.style.visibility = 'visible';
  }

  startTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const sconds = time % 60;
    this.$gameTimer.innerText = `${minutes} : ${sconds}`;
  }

  updateScoreBoard() {
    this.$gameScore.innerText = this.carrotCount - this.score;
  }

  hideGameButton() {
    this.$gameBtn.style.visibility = 'hidden';
  }
}
