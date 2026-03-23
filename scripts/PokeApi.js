const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let pokemonOffset = 0;
let pokemonList = [];

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