const evolutionApiUrl = 'https://pokeapi.co/api/v2/evolution-chain/';

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function fetchEvolutionChain(pokemonName) {
  const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`).then(res => res.json());
  const chainId = species.evolution_chain.url.split("/").slice(-2, -1)[0];
  return fetch(`${evolutionApiUrl}${chainId}/`).then(res => res.json());
}

function parseEvolutionData(evolutionData) {
  const chain = [];
  let stage = evolutionData.chain;
  while (stage) {
    chain.push({ name: stage.species.name, image: `https://img.pokemondb.net/artwork/large/${stage.species.name}.jpg` });
    stage = stage.evolves_to[0];
  }
  return chain;
}

async function updateModalTab(selectedTab, pokemonData, modalContent) {
  const infoBox = modalContent.querySelector(".info-box");
  if (selectedTab === "Stats") return infoBox.innerHTML = generateStatsTemplate(pokemonData);
  if (selectedTab === "Evolution") {
    const data = await fetchEvolutionChain(pokemonData.name);
    pokemonData.evolutionChain = parseEvolutionData(data);
    return infoBox.innerHTML = generateEvolutionTemplate(pokemonData);
  }
  infoBox.innerHTML = generateOverviewTemplate(pokemonData);
}

function openPokemonModal(pokemon, index, list) {
  document.getElementById("pokemon-modal")?.remove();

  const modal = createElementWithClass("div", "modal");
  modal.id = "pokemon-modal";
  const content = createElementWithClass("div", "modal-content");

  content.append(createCloseButton(modal), createModalHeader(pokemon), createTabMenu(pokemon, content), createInfoBox(pokemon), createNavigationButtons(list, index));
  modal.appendChild(content);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function createElementWithClass(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function createCloseButton(modal) {
  const btn = createElementWithClass("span", "close-button");
  btn.textContent = "×";
  btn.onclick = () => modal.remove();
  return btn;
}

function createModalHeader(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const img = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || "#";
  const header = createElementWithClass("div", `modal-header type-${mainType}`);

  header.innerHTML = `
    <h2>${capitalize(pokemon.name)}</h2>
    <span class="poke-id">#${pokemon.id}</span>
    <img src="Icons/default/pokeball.svg" class="pokeball-bg" />
    <img src="${img}" class="pokemon-img" />
    <div class="type-container">
      ${pokemon.types.map(t => `<span class="type-badge">${capitalize(t.type.name)}</span>`).join("")}
    </div>
  `;
  return header;
}

function createTabMenu(pokemon, modalContent) {
  const tabMenu = createElementWithClass("div", "modal-tabs");
  ["Overview", "Stats", "Evolution"].forEach((tabName, i) => {
    const tab = createButton(tabName, "tab-button" + (i === 0 ? " active" : ""), () => {
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      tab.classList.add("active");
      updateModalTab(tabName, pokemon, modalContent);
    });
    tabMenu.appendChild(tab);
  });
  return tabMenu;
}

function createInfoBox(pokemon) {
  const infoBox = createElementWithClass("div", "info-box");
  infoBox.innerHTML = generateOverviewTemplate(pokemon);
  return infoBox;
}

function createButton(text, className, onClick) {
  const btn = createElementWithClass("button", className);
  btn.innerHTML = text;
  btn.onclick = onClick;
  return btn;
}

function createNavigationButtons(list, currentIndex) {
  const nav = createElementWithClass("div", "modal-nav");
  nav.append(createNavButton("&#8592;", currentIndex > 0, () => openPokemonModal(list[currentIndex - 1], currentIndex - 1, list)));
  nav.append(createNavButton("&#8594;", currentIndex < list.length - 1, () => openPokemonModal(list[currentIndex + 1], currentIndex + 1, list)));
  return nav;
}

function createNavButton(text, enabled, action) {
  const btn = createButton(text, "", enabled ? action : () => {});
  updateButtonState(btn, !enabled);
  return btn;
}

function updateButtonState(button, isDisabled) {
  button.disabled = isDisabled;
  button.style.opacity = isDisabled ? "0.5" : "1";
  button.style.cursor = isDisabled ? "default" : "pointer";
}
