import { Grid } from './grid.js';
import {
  GAME_SCORE_MIN_MUL,
  GAME_SCORE_MAX_MUL,
  GAME_SCORE_TIMER,
} from './gameConstants.js';

export class GameConstruct {
  constructor(recordsList) {
    this.recordsList = recordsList;

    this.initElems();
    this.turnOffContextmenu();

    this.maxScore = 0;

    this.keyHandler = this.keyHandler.bind(this);
    this.startTimer = this.startTimer.bind(this);

    this.createGrid();
    this.addKeyStarter();
    this.setBaseValues();
  }

  turnOffContextmenu() {
    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      return;
    });
  }

  initElems() {
    this.gridWrapper = document.getElementById('game-grid-wrapper');
    this.timerElem = document.getElementById('game-stats-timer');
    this.scoreElem = document.getElementById('game-stats-score');
    this.topScoreElem = document.getElementById('game-stats-top-score');
    this.mulElem = document.getElementById('game-message-speed');
  }

  setBaseValues() {
    this.score = 0;
    this.timer = GAME_SCORE_TIMER;
    this.tenthOfSec = 0;
    this.timerInMs = GAME_SCORE_TIMER * 1000;
    this.scoreMul = GAME_SCORE_MIN_MUL;
    this.scoreMulPoints = 500;
  }

  setDisplayedValues() {
    this.timerElem.innerHTML = this.timer;
    this.scoreElem.innerHTML = this.score;
    this.topScoreElem.innerHTML = this.maxScore;
    this.mulElem.innerHTML = this.scoreMul;
  }

  increasePoints() {
    this.score += this.scoreMul;
    this.scoreElem.innerHTML = this.score;
  }

  createGrid() {
    const grid = new Grid(this.gridWrapper, this);
    this.grid = grid;
    this.gridWrapper.append(grid.gridElem);
  }

  startGame() {
    if (this.grid.started) {
      this.updNewTopScore();
      this.grid.gridElem.remove();
      this.createGrid();
      this.setBaseValues();
      this.setDisplayedValues();
    } else {
      this.mulElem.innerHTML = this.scoreMul;
    }
    this.grid.start();
    this.timerId = setTimeout(this.startTimer, 100);
  }

  stopGame() {
    this.stopTimer();
    this.grid.stop();
  }

  startTimer() {
    if (this.timer <= 0 && this.tenthOfSec === 0) {
      this.updTimer(true);
      this.addNewRecordToRecList();
      this.sortAndRemoveLovestFromRecList();
      this.stopGame();
      return;
    }

    this.updTimer();
    this.decreaseMulPoints();

    if (this.tenthOfSec === 0) {
      this.tenthOfSec = 9;
    } else {
      this.tenthOfSec -= 1;
    }

    this.timerId = setTimeout(this.startTimer, 100);
  }

  increaseMulPoints() {
    const newScoreMul = this.scoreMulPoints + 150;
    if (newScoreMul >= 1000) {
      this.scoreMulPoints = 500;
      this.scoreMul =
        this.scoreMul < GAME_SCORE_MAX_MUL ? this.scoreMul + 1 : this.scoreMul;
      this.mulElem.innerHTML = this.scoreMul;
    } else {
      this.scoreMulPoints = newScoreMul;
    }
  }

  decreaseMulPoints() {
    const newScoreMul = this.scoreMulPoints - 50;
    if (newScoreMul <= 0) {
      if (this.scoreMul > GAME_SCORE_MIN_MUL) {
        this.scoreMul -= 1;
        this.mulElem.innerHTML = this.scoreMul;
        this.scoreMulPoints = 500;
      } else {
        this.scoreMulPoints = 0;
      }
    } else {
      this.scoreMulPoints = newScoreMul;
    }
  }

  stopTimer() {
    clearTimeout(this.timerId);
    this.timerId = null;
  }

  addKeyStarter() {
    document.addEventListener('keydown', this.keyHandler);
  }

  keyHandler(event) {
    if (this.grid.started) {
      this.stopGame();
      this.startGame();
    } else {
      this.startGame();
    }
  }

  updNewTopScore() {
    const newMax = this.score > this.maxScore ? this.score : this.maxScore;
    this.maxScore = newMax;
    this.topScoreElem.innerHTML = newMax;
  }

  updTimer(boolean) {
    if (boolean) {
      this.timer = 0;
      this.timerElem.innerHTML = 0;
      return;
    }

    if (this.tenthOfSec === 0) {
      this.timer -= 1;
    }

    this.timerElem.innerHTML = `${this.timer}.${this.tenthOfSec}`;
  }

  addNewRecordToRecList() {
    const score = this.score;

    const li = document.createElement('li');
    li.dataset.score = score;

    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const str = `${score} - ${hours}:${minutes}`;
    li.innerHTML = str;
    this.recordsList.append(li);
  }

  sortAndRemoveLovestFromRecList() {
    const recColection = [...this.recordsList.children];
    const sortedColection = recColection.sort(
      (a, b) => a.dataset.score - b.dataset.score
    );
    recColection.forEach((i) => i.remove());
    sortedColection.forEach((i) => this.recordsList.prepend(i));

    if (this.recordsList.children.length > 8) {
      this.recordsList.lastElementChild.remove();
    }
  }
}
