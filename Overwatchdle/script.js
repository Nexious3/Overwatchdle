let heroes = [];
let targetHero = null;
let guessCount = 0;
let guessedHeroNames = new Set();
let selectedHero = null;

const input = document.getElementById('hero-input');
const autocompleteList = document.getElementById('autocomplete-list');
const submitBtn = document.getElementById('submit-btn');
const guessesContainer = document.getElementById('guesses-container');

async function loadHeroData() {
  try {
    const response = await fetch('heroes.json');
    heroes = await response.json();
    targetHero = heroes[Math.floor(Math.random() * heroes.length)];
    setupEventListeners();
  } catch (error) {
    console.error("Error loading hero data:", error);
  }
}

function setupEventListeners() {
  input.addEventListener('input', handleAutocomplete);
  input.addEventListener('keydown', handleKeyDown);
  submitBtn.addEventListener('click', handleSubmit);

  document.getElementById('quote-card').addEventListener('click', () => revealClue('quote'));
  document.getElementById('ability-card').addEventListener('click', () => revealClue('ability'));
  document.getElementById('silhouette-card').addEventListener('click', () => revealClue('silhouette'));
}

function handleAutocomplete() {
  const query = input.value.toLowerCase().trim();
  autocompleteList.innerHTML = '';
  selectedHero = null;
  if (!query) return;

  const matches = heroes.filter(h => 
    h.name.toLowerCase().includes(query) && !guessedHeroNames.has(h.name.toLowerCase())
  );

  if (matches.length > 0) {
    selectedHero = matches[0];
  }

  matches.forEach((hero, index) => {
    const li = document.createElement('li');
    li.className = 'autocomplete-item';
    if (index === 0) li.classList.add('selected');
    
    li.innerHTML = `<img src="${hero.image}" alt="${hero.name}"> <span>${hero.name}</span>`;
    
    li.onclick = () => {
      input.value = hero.name;
      selectedHero = hero;
      autocompleteList.innerHTML = '';
      handleSubmit();
    };
    
    autocompleteList.appendChild(li);
  });
}

function handleKeyDown(e) {
  const items = autocompleteList.querySelectorAll('.autocomplete-item');

  if (e.key === 'Enter') {
    e.preventDefault();
    handleSubmit();
    return;
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (items.length === 0) return;
    e.preventDefault();

    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));

    if (currentIndex !== -1) {
      items[currentIndex].classList.remove('selected');
    }

    if (e.key === 'ArrowDown') {
      currentIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
    }

    items[currentIndex].classList.add('selected');
    
    const heroName = items[currentIndex].querySelector('span').textContent;
    selectedHero = heroes.find(h => h.name === heroName);
  }
}

function handleSubmit() {
  const rawInput = input.value.toLowerCase().trim();
  const heroToGuess = selectedHero || heroes.find(h => h.name.toLowerCase() === rawInput);

  if (!heroToGuess) {
    alert("Please select a valid hero from the list!");
    return;
  }

  if (guessedHeroNames.has(heroToGuess.name.toLowerCase())) {
    alert("You have already guessed this hero!");
    return;
  }

  makeGuess(heroToGuess);
  input.value = '';
  selectedHero = null;
  autocompleteList.innerHTML = '';
}

function makeGuess(guessedHero) {
  guessCount++;
  guessedHeroNames.add(guessedHero.name.toLowerCase());

  updateClueCards();

  const row = document.createElement('div');
  row.className = 'guess-row';

  const properties = ['image', 'gender', 'role', 'species', 'origin', 'affiliation', 'health', 'releaseYear'];

  properties.forEach(prop => {
    const tile = document.createElement('div');
    tile.className = 'tile';

    let val = guessedHero[prop];

    if (prop === 'image') {
      tile.innerHTML = `<img src="${val}" alt="${guessedHero.name}">`;
    } else {
      if (prop === 'health' || prop === 'releaseYear') {
        if (val < targetHero[prop]) val += ' ↑';
        else if (val > targetHero[prop]) val += ' ↓';
      }
      tile.textContent = val;
    }

    if (guessedHero[prop] === targetHero[prop]) {
      tile.classList.add('correct');
    } else {
      tile.classList.add('incorrect');
    }

    row.appendChild(tile);
  });

  guessesContainer.prepend(row);

  if (guessedHero.name === targetHero.name) {
    setTimeout(() => alert(`🎉 Victory! Today's hero was ${targetHero.name}!`), 100);
  }
}

function updateClueCards() {
  if (guessCount >= 4) {
    const quoteCard = document.getElementById('quote-card');
    const quoteStatus = document.getElementById('quote-status');
    if (quoteCard && !quoteCard.classList.contains('revealed')) {
      quoteCard.classList.add('unlocked');
      quoteStatus.textContent = 'CLICK TO REVEAL';
    }
  }
  if (guessCount >= 8) {
    const abilityCard = document.getElementById('ability-card');
    const abilityStatus = document.getElementById('ability-status');
    if (abilityCard && !abilityCard.classList.contains('revealed')) {
      abilityCard.classList.add('unlocked');
      abilityStatus.textContent = 'CLICK TO REVEAL';
    }
  }
  if (guessCount >= 12) {
    const silhouetteCard = document.getElementById('silhouette-card');
    const silhouetteStatus = document.getElementById('silhouette-status');
    if (silhouetteCard && !silhouetteCard.classList.contains('revealed')) {
      silhouetteCard.classList.add('unlocked');
      silhouetteStatus.textContent = 'CLICK TO REVEAL';
    }
  }
}

function revealClue(type) {
  if (type === 'quote' && guessCount >= 4) {
    const card = document.getElementById('quote-card');
    const status = document.getElementById('quote-status');
    card.classList.add('revealed');
    status.textContent = `"${targetHero.quote || 'No quote available'}"`;
  } else if (type === 'ability' && guessCount >= 8) {
    const card = document.getElementById('ability-card');
    const status = document.getElementById('ability-status');
    card.classList.add('revealed');
    status.textContent = targetHero.role;
  } else if (type === 'silhouette' && guessCount >= 12) {
    const card = document.getElementById('silhouette-card');
    const status = document.getElementById('silhouette-status');
    card.classList.add('revealed');
    status.textContent = targetHero.species;
  }
}

loadHeroData();