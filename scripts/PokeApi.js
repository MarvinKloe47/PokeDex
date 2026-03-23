const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const generationMap = {
  kanto: 1,
  hoenn: 3
};
let pokemonOffset = 0;
let pokemonList = [];
let isRegionMode = false;
let currentRegion = "all";

async function fetchPokemon() {
  try {
    const response = await fetch(`${apiUrl}?limit=20&offset=${pokemonOffset}`);
    const data = await response.json();
    return await processPokemonBatch(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function processPokemonBatch(results) {
  const batch = [];
  for (const pokemon of results) {
    const details = await fetch(pokemon.url);
    const data = await details.json();
    batch.push(data);
  }
  pokemonList = pokemonList.concat(batch);
  pokemonList.sort((a, b) => a.id - b.id);
  return batch;
}

async function loadMorePokemon() {
  if (isRegionMode) return;
  const loadMoreButton = document.getElementById("load-more_btn");
  const loader = document.querySelector(".loader");

  loadMoreButton.style.display = "none";
  loader.style.display = "block";

  pokemonOffset += 20;
  await fetchPokemon();
  await displayPokemonList();

  loader.style.display = "none";
  loadMoreButton.style.display = "block";
}

async function fetchPokemonByRegion(regionKey) {
  const generationId = generationMap[regionKey];
  if (!generationId) return [];

  const response = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`);
  const data = await response.json();
  const speciesNames = data.pokemon_species.map((species) => species.name);

  const requests = speciesNames.map(async (name) => {
    const res = await fetch(`${apiUrl}/${name}`);
    if (!res.ok) {
      console.warn(`Skipping Pokemon with missing data: ${name}`);
      return null;
    }
    return res.json();
  });

  const results = await Promise.all(requests);
  const details = results.filter((item) => item !== null);
  return details.sort((a, b) => a.id - b.id);
}

function setActiveRegionButton(regionKey) {
  const buttons = document.querySelectorAll(".region-btn");
  buttons.forEach((btn) => {
    const isActive = btn.dataset.region === regionKey;
    btn.classList.toggle("active", isActive);
  });
}

async function setRegion(regionKey) {
  const loadMoreButton = document.getElementById("load-more_btn");
  const loader = document.querySelector(".loader");
  const searchInput = document.getElementById("searchbar");

  currentRegion = regionKey;
  setActiveRegionButton(regionKey);
  if (searchInput) searchInput.value = "";
  clearPokemonCards();

  if (regionKey === "all") {
    isRegionMode = false;
    pokemonOffset = 0;
    pokemonList = [];
    loadMoreButton.style.display = "none";
    loader.style.display = "block";
    await displayPokemonList();
    loader.style.display = "none";
    loadMoreButton.style.display = "block";
    return;
  }

  isRegionMode = true;
  loadMoreButton.style.display = "none";
  loader.style.display = "block";
  const regionPokemon = await fetchPokemonByRegion(regionKey);
  pokemonList = regionPokemon;
  await displayPokemonList(regionPokemon);
  loader.style.display = "none";
}