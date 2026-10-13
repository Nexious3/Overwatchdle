// Hero Dataset
const heroes = [
  { name: "Ashe", gender: "Female", role: "Damage", species: "Human", origin: "USA", affiliation: "Deadlock Gang", health: 200, releaseYear: 2018, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3429c21f008f3a3f5a34e56598c199580ef11a87a25032a514d2a13f04d9a1f0.png", quote: "My business, my rules." },
  { name: "Baptiste", gender: "Male", role: "Support", species: "Human", origin: "Haiti", affiliation: "Talon (Formerly)", health: 200, releaseYear: 2019, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/f4648a3138b29c922a613583d7a9643444a1e944b1c55d0459c5d0ef14df0eb2.png", quote: "Thank you for your compliance!" },
  { name: "Bastion", gender: "Other", role: "Damage", species: "Omnic", origin: "Unknown", affiliation: "Overwatch", health: 300, releaseYear: 2016, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3920958f339efeb285328e181d11e5c3e7f41334c442e399589d81648a58dd98.png", quote: "Beep boop bop!" },
  { name: "Hanzo", gender: "Male", role: "Damage", species: "Human", origin: "Japan", affiliation: "Shimada Clan", health: 200, releaseYear: 2016, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3860d5b376241b31a31b64e52f10b7849e7b2f42a5538e12f913d96fa34d8e78.png", quote: "With every death comes honor." },
  { name: "Kiriko", gender: "Female", role: "Support", species: "Human", origin: "Japan", affiliation: "Yamagami Clan", health: 200, releaseYear: 2022, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/95d85e7a9b0e7d53b2d1d072f447f52554e2f9d3b3cf89c3132bbcb4604d7c7c.png", quote: "Let the Kitsune guide you!" },
  { name: "Reinhardt", gender: "Male", role: "Tank", species: "Human", origin: "Germany", affiliation: "Overwatch", health: 600, releaseYear: 2016, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/5e173e3518a28f8045934661830bbfa96d11e4f451f2f811cb4df2e92c28a8d1.png", quote: "Honor and glory!" },
  { name: "Tracer", gender: "Female", role: "Damage", species: "Human", origin: "United Kingdom", affiliation: "Overwatch", health: 175, releaseYear: 2016, image: "https://d15f34w2p8l1cc.cloudfront.net/overwatch/4983057e025f8d2f1f3a2818a7d3a2468f7004f14187010f3c5bdf1821815e34.png", quote: "Cheers, love! The cavalry's here!" }
];

// Pick today's target hero randomly
const targetHero = heroes[Math.floor(Math.random() * heroes.length)];
let guessCount = 0;
let selectedHero = null;

// DOM Elements
const input = document.getElementById('hero-input');
const autocompleteList = document.getElementById('autocomplete-list');
const submitBtn = document.getElementById('submit-btn');
const guessesContainer = document.getElementById('guesses-container');

// Autocomplete Logic
input.addEventListener('input', () => {
  const query = input.value.toLowerCase().trim();
  autocompleteList.innerHTML = '';
  selectedHero = null;
  if (!query) return;

  const matches = heroes.filter(h => h.name.toLowerCase().includes(query));
  matches.forEach(hero => {
    const li = document.createElement('li');
    li.className = 'autocomplete-item';
    li.innerHTML = `<img src="${hero.image}" alt="${hero.name}"> <span>${hero.name}</span>`;
    
    li.onclick = () => {
      input.value = hero.name;
      selectedHero = hero;
      autocompleteList.innerHTML = '';
    };
    
    autocompleteList.appendChild(li);
  });
});

// Submit Button Event
submitBtn.addEventListener('click', () => {
  const heroToGuess = selectedHero || heroes.find(h => h.name.toLowerCase() === input.value.toLowerCase().trim());
  if (heroToGuess) {
    makeGuess(heroToGuess);
    input.value = '';
    selectedHero = null;
    autocompleteList.innerHTML = '';
  } else {
    alert("Please select a valid hero from the list!");
  }
});

function makeGuess(guessedHero) {
  guessCount++;
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

    // Apply color logic
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

// Progressive Clue Unlocking Logic
function updateClueCards() {
  if (guessCount >= 4) {
    const quoteCard = document.getElementById('quote-card');
    quoteCard.classList.add('unlocked');
    document.getElementById('quote-status').textContent = `"${targetHero.quote}"`;
  }
  if (guessCount >= 8) {
    const abilityCard = document.getElementById('ability-card');
    abilityCard.classList.add('unlocked');
    document.getElementById('ability-status').textContent = "UNLOCKED!";
  }
  if (guessCount >= 12) {
    const silhouetteCard = document.getElementById('silhouette-card');
    silhouetteCard.classList.add('unlocked');
    document.getElementById('silhouette-status').textContent = "UNLOCKED!";
  }
}