const pokemonContainer = document.getElementById("poke-container");
const loadingSpinner = document.querySelector(".lds-ring");

const typeColors = {
  fire: "#e03a3a",
  grass: "#50C878",
  electric: "#fad343",
  water: "#1E90FF",
  ground: "#735139",
  rock: "#63594f",
  fairy: "#EE99AC",
  poison: "#b34fb3",
  bug: "#A8B820",
  dragon: "#fc883a",
  psychic: "#882eff",
  flying: "#87CEEB",
  fighting: "#bf5858",
  normal: "#D2B48C",
  ghost: "#7B62A3",
  dark: "#414063",
  steel: "#808080",
  ice: "#98D8D8"
};

const mainTypes = Object.keys(typeColors);

function createPokemonCard(pokemon, index, pokemonData) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cardContainer");

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("card");
  pokemonCard.id = pokemon.id;

  const cardTemplate = generatePokemonCardTemplate(pokemon);
  pokemonCard.innerHTML = cardTemplate;

  const types = pokemon.types.map((type) => type.type.name);
  const mainType = mainTypes.find((type) => types.includes(type));
  const color = typeColors[mainType] || "#fff";
  pokemonCard.style.backgroundColor = color;

  pokemonCard.addEventListener("click", () => {
    openPokemonModal(pokemon, index, pokemonData);
  });

  appendPokemonCard(cardContainer, pokemonCard);
}

function formatPokemonName(name) {
  let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  if (formattedName.length > 9) {
    formattedName = formattedName.split("-")[0];
  }
  return formattedName;
}

async function displayPokemonList(pokemonData = null) {
  const data = pokemonData || await fetchPokemon();
  const listForModal = pokemonData || pokemonList;
  data.forEach((pokemon) => {
    const index = listForModal.indexOf(pokemon);
    createPokemonCard(pokemon, index, listForModal);
  });
}

function setupDarkModeToggle() {
  const darkModeButton = document.getElementById("dark");
  darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeButton.classList.toggle("fa-toggle-on");
  });
}

displayPokemonList();
setupDarkModeToggle();

function appendPokemonCard(container, card) {
  container.appendChild(card);
  pokemonContainer.appendChild(container);
}

function clearPokemonCards() {
  pokemonContainer.innerHTML = "";
  const noResultsMessage = document.getElementById("no-results-message");
  if (noResultsMessage) noResultsMessage.remove();
}