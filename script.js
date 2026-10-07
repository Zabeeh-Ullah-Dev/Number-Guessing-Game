// Game state: the secret number, guesses made, and the round number.
let secretNumber = generateNumber();
let previousGuesses = [];
let roundNumber = 1;
const maximumAttempts = 10;

const guessForm = document.getElementById('guess-form');
const guessInput = document.getElementById('guess-input');
const guessButton = document.querySelector('.guess-button');
const attemptCount = document.getElementById('attempt-count');
const attemptProgress = document.getElementById('attempt-progress');
const attemptFill = document.getElementById('attempt-fill');
const guessList = document.getElementById('guess-list');
const guessTotal = document.getElementById('guess-total');
const gameMessage = document.getElementById('game-message');
const messageBox = document.getElementById('message-box');
const messageIcon = document.getElementById('message-icon');
const performance = document.getElementById('performance');
const roundCount = document.getElementById('round-count');
const restartButton = document.getElementById('restart-button');

// Pick a whole number in the inclusive range 1–100.
function generateNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function setMessage(message, state = 'neutral', icon = '↳') {
  gameMessage.textContent = message;
  messageBox.dataset.state = state;
  messageIcon.textContent = icon;
}

function getPerformance(attempts) {
  if (attempts <= 3) return 'Excellent';
  if (attempts <= 6) return 'Very Good';
  return 'Good';
}

function updateHistory() {
  guessList.innerHTML = '';
  if (previousGuesses.length === 0) {
    const emptyMessage = document.createElement('span');
    emptyMessage.className = 'empty-history';
    emptyMessage.textContent = 'They’ll show up here as you play.';
    guessList.appendChild(emptyMessage);
  } else {
    // Build the visible chips from the same array that stores each guess.
    previousGuesses.forEach((guess) => {
      const chip = document.createElement('span');
      chip.className = 'guess-chip';
      chip.textContent = guess;
      guessList.appendChild(chip);
    });
  }
  guessTotal.textContent = `${previousGuesses.length} ${previousGuesses.length === 1 ? 'guess' : 'so far'}`;
}

function updateAttempts() {
  attemptCount.textContent = previousGuesses.length;
  attemptProgress.setAttribute('aria-valuenow', previousGuesses.length);
  attemptFill.style.width = `${(previousGuesses.length / maximumAttempts) * 100}%`;
}

function finishGame(message, state) {
  guessInput.disabled = true;
  guessButton.disabled = true;
  setMessage(message, state, state === 'success' ? '✓' : '!');
  performance.textContent = getPerformance(previousGuesses.length);
  performance.classList.add('is-set');
  guessInput.blur();
}

guessForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const guess = Number(guessInput.value);

  if (guessInput.value.trim() === '' || !Number.isInteger(guess) || guess < 1 || guess > 100) {
    setMessage('Enter a whole number from 1 to 100 to play.', 'error', '!');
    guessInput.focus();
    return;
  }

  if (previousGuesses.includes(guess)) {
    setMessage(`You already tried ${guess}. Give another number a go.`, 'warning', '↻');
    guessInput.select();
    return;
  }

  // Save each valid guess before comparing it with the secret number.
  previousGuesses.push(guess);
  updateHistory();
  updateAttempts();
  guessInput.value = '';

  if (guess === secretNumber) {
    finishGame(`Correct! You found ${secretNumber} in ${previousGuesses.length} ${previousGuesses.length === 1 ? 'try' : 'tries'}.`, 'success');
  } else if (previousGuesses.length === maximumAttempts) {
    finishGame(`That was your tenth try. The number was ${secretNumber}.`, 'warning');
  } else if (guess > secretNumber) {
    setMessage('Too High! Try again.', 'warning', '↓');
  } else {
    setMessage('Too Low! Try again.', 'warning', '↑');
  }
});

restartButton.addEventListener('click', () => {
  // Start a clean round and return focus to the guess field.
  secretNumber = generateNumber();
  previousGuesses = [];
  roundNumber += 1;
  roundCount.textContent = String(roundNumber).padStart(2, '0');
  guessInput.disabled = false;
  guessButton.disabled = false;
  guessInput.value = '';
  performance.textContent = '—';
  performance.classList.remove('is-set');
  updateAttempts();
  updateHistory();
  setMessage('Your first guess is waiting.', 'neutral', '↳');
  guessInput.focus();
});
