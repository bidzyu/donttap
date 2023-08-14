export class Cell {
  constructor(index) {
    this.index = index;
    this.isEmpty = true;
    this.cellElem = document.createElement('div');
    this.cellElem.classList.add('cell');
  }

  addMissPoint(x, y) {
    const point = document.createElement('div');
    point.classList.add('miss-point');

    this.cellElem.append(point);

    const coordObj = point.getBoundingClientRect();

    point.style.left = x - coordObj.width / 2 + 'px';
    point.style.top = y - coordObj.height / 2 + 'px';
  }
}
