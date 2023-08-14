import { GameConstruct } from './gameConstruct.js';
const recordsBtnElem = document.getElementById('records-btn');
const recordsElem = document.querySelector('.records-wrapper');
const recordsListElem = document.getElementById('records-list');

recordsBtnElem.addEventListener('pointerdown', function (event) {
  const isVisible = recordsBtnElem.dataset.isVisible;

  if (isVisible) {
    recordsBtnElem.dataset.isVisible = '';
    recordsElem.style.display = '';
  } else {
    recordsBtnElem.dataset.isVisible = true;
    recordsElem.style.display = 'block';
  }
});

const game = new GameConstruct(recordsListElem);
