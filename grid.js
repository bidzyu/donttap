import {
  GAME_COLUMNS_COUNT,
  GAME_ROWS_COUNT,
  GAME_TOTAL_CELLS_COUNT,
} from './gameConstants.js';
import { Cell } from './cell.js';

export class Grid {
  constructor(wrapper, gameConstruct) {
    this.started = false;
    this.gridWrapper = wrapper;
    this.gameConstruct = gameConstruct;
    this.gridElem = document.createElement('div');
    this.gridElem.id = 'game-grid';
    this.virtualCellsMap = new Map();
    this.selectedCellsMap = new Map();

    for (let i = 0; i < GAME_TOTAL_CELLS_COUNT; i++) {
      const cell = new Cell(i);

      this.gridElem.append(cell.cellElem);
      this.virtualCellsMap.set(cell.cellElem, cell);
    }

    this.gridClickHandler = this.gridClickHandler.bind(this);
  }

  start() {
    this.started = true;
    this.selectSomeEmptyCells(3);
    this.gridElem.addEventListener('pointerdown', this.gridClickHandler);
  }

  stop() {
    this.gridElem.removeEventListener('pointerdown', this.gridClickHandler);
  }

  gridClickHandler(event) {
    const cellElement = event.target;
    const isSelected = cellElement.classList.contains('selected');

    if (isSelected) {
      this.gameConstruct.increasePoints();
      this.gameConstruct.increaseMulPoints();
      cellElement.classList.remove('selected');
      this.selectRandomEmptyCell();

      const cell = this.selectedCellsMap.get(cellElement);
      cell.isEmpty = true;
      this.selectedCellsMap.delete(cellElement);
    } else {
      cellElement.classList.add('missed');
      this.stop();
      this.gameConstruct.addNewRecordToRecList();
      this.gameConstruct.sortAndRemoveLovestFromRecList();
      this.gameConstruct.stopGame();
      const cell = this.virtualCellsMap.get(cellElement);
      const x = event.clientX - cellElement.getBoundingClientRect().x;
      const y = event.clientY - cellElement.getBoundingClientRect().y;
      cell.addMissPoint(x, y);
    }
  }

  getRandomEmptyCell() {
    const filteredCellsList = [...this.virtualCellsMap.values()].filter(
      (cell) => cell.isEmpty
    );
    const randomIndex = Math.floor(Math.random() * filteredCellsList.length);

    return filteredCellsList[randomIndex];
  }

  selectSomeEmptyCells(value) {
    for (let i = 0; i < value; i++) {
      this.selectRandomEmptyCell();
    }
  }

  selectRandomEmptyCell() {
    const emptyCell = this.getRandomEmptyCell();

    emptyCell.isEmpty = false;
    emptyCell.cellElem.classList.add('selected');

    this.selectedCellsMap.set(emptyCell.cellElem, emptyCell);
  }
}
