'use strict';
import PopUp from './popup.js';
import * as sound from './sound.js';
import { GameBuilder, Reason } from './game.js';

const game = new GameBuilder()
  .gameDuration(5)
  .carrotCount(10)
  .bugCount(20)
  .build();
const gamePopUp = new PopUp();

game.setGameStopListener(reason => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = 'Repaly?';
      sound.playAlert();
      break;
    case Reason.win:
      message = 'You Win!';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'You Lost';
      sound.playBug();
      break;
    default:
      throw new Error('not valid reason');
  }
  gamePopUp.showWithText(message);
});
gamePopUp.setClickListener(() => game.start());
