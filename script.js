import { GameConstruct } from './gameConstruct.js';
const recordsBtnElem = document.getElementById('records-btn');
const recordsElem = document.querySelector('.records-wrapper');
const recordsListElem = document.getElementById('records-list');
const gameMessagePanelElem = document.getElementById('game-message-panel');

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

gameMessagePanelElem.addEventListener('pointerdown', callKeydownEvent);

function callKeydownEvent() {
  const event = new Event('keydown', { bubbles: true, composed: true });
  document.dispatchEvent(event);
}

const game = new GameConstruct(recordsListElem);
