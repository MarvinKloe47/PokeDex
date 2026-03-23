function filterPokemonCards() {
  const searchInput = getCleanSearchInput();
  const pokemonCards = document.getElementsByClassName("cardContainer");
  const noResultsMessageId = "no-results-message";

  if (searchInput.length >= 3) {
    handleFilteredResults(searchInput, pokemonCards, noResultsMessageId);
  } else {
    showAllPokemonCards(pokemonCards);
    removeNoResultsMessage(noResultsMessageId);
  }
}

function getCleanSearchInput() {
  return document.getElementById("searchbar").value.toLowerCase().replace(/\s+/g, "");
}

function handleFilteredResults(searchInput, pokemonCards, noResultsMessageId) {
  let matchesFound = false;

  Array.from(pokemonCards).forEach(card => {
    const isVisible = card.innerHTML.toLowerCase().includes(searchInput);
    card.style.display = isVisible ? "block" : "none";
    if (isVisible) matchesFound = true;
  });

  matchesFound ? removeNoResultsMessage(noResultsMessageId) : showNoResultsMessage(noResultsMessageId);
}

function showNoResultsMessage(noResultsMessageId) {
  if (!document.getElementById(noResultsMessageId)) {
    const message = document.createElement("div");
    Object.assign(message, {
      id: noResultsMessageId,
      textContent: "Kein Pokémon gefunden."
    });
    Object.assign(message.style, {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "18px",
      color: "#ff0000"
    });
    document.getElementById("poke-container").appendChild(message);
  }
}

function removeNoResultsMessage(noResultsMessageId) {
  const existingMessage = document.getElementById(noResultsMessageId);
  if (existingMessage) existingMessage.remove();
}

function showAllPokemonCards(pokemonCards) {
  Array.from(pokemonCards).forEach(card => {
    card.style.display = "block";
  });
}
