const grid = document.getElementById('grid');
const movesCounter = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const bestElement = document.getElementById('best');
const message = document.getElementById('message');
const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const restartBtn = document.getElementById('restart');

let icons = ['🍎','🍌','🍒','🍇','🍍','🍓','🥝','🍉'];
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let timer;
let seconds = 0;
let lockBoard = false;

function shuffle(array) {
  return array.concat(array).sort(() => 0.5 - Math.random());
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerElement.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetStats() {
  moves = 0;
  seconds = 0;
  matched = 0;
  movesCounter.textContent = 0;
  timerElement.textContent = 0;
}

function createCard(icon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="front"></div>
    <div class="back" style="background: white; display: flex; align-items: center; justify-content: center; font-size: 2rem;">${icon}</div>
  `;
  card.addEventListener('click', () => flipCard(card, icon));
  return card;
}

function flipCard(card, icon) {
  if (lockBoard || card.classList.contains('flip')) return;

  card.classList.add('flip');
  flipped.push({ card, icon });

  if (flipped.length === 1 && moves === 0) startTimer();

  if (flipped.length === 2) {
    moves++;
    movesCounter.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flipped;

  if (first.icon === second.icon) {
    matched += 1;
    flipped = [];
    if (matched === icons.length) endGame();
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.card.classList.remove('flip');
      second.card.classList.remove('flip');
      flipped = [];
      lockBoard = false;
    }, 1000);
  }
}

function endGame() {
  stopTimer();
  message.style.display = 'block';
  finalTime.textContent = seconds;
  finalMoves.textContent = moves;

  const best = JSON.parse(localStorage.getItem('bestScore'));
  if (!best || seconds < best.time || (seconds === best.time && moves < best.moves)) {
    localStorage.setItem('bestScore', JSON.stringify({ time: seconds, moves }));
  }

  updateBest();
}

function updateBest() {
  const best = JSON.parse(localStorage.getItem('bestScore'));
  bestElement.textContent = best ? `${best.time} сек / ${best.moves} ходов` : '—';
}

function startGame() {
  message.style.display = 'none';
  grid.innerHTML = '';
  resetStats();
  stopTimer();
  updateBest();

  const shuffled = shuffle(icons);
  shuffled.forEach(icon => {
    const card = createCard(icon);
    grid.appendChild(card);
  });
}

restartBtn.addEventListener('click', startGame);

startGame();
