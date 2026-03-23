function generatePokemonCardTemplate(pokemon) {
  const name = formatPokemonName(pokemon.name);
  const id = pokemon.id.toString().padStart(3, "0");
  const weight = (pokemon.weight / 10) + "kg";
  const height = (pokemon.height / 10) + "m";
  const types = pokemon.types.map(type => type.type.name);
  const frontImage = pokemon.sprites.front_default || "#";
  const backImage = pokemon.sprites.back_default || "#";

  return `
    <div class="front side">
      <div class="img-container">
        <img class="background" src="./Icons/default/pokeball.svg" alt="pokeball">
        <img class="image" src="${frontImage}" alt="${name}">
      </div>
      <span class="number">#${id}</span>
      <h3 class="name">${name}</h3>
      <div class="types">
        ${types.map(type => `
          <div class="poke__type__bg ${type}">
            <img src="Icons/${type}.svg" alt="Type">
          </div>
        `).join("")}
      </div>
    </div>
    <div class="back side">
      <div class="img-container">
        <img class="image" src="${backImage}" alt="${name}">
        <img class="background" src="./Icons/default/pokeball.svg" alt="pokeball">
      </div>
      <span class="number">#${id}</span>
      <div class="stats">
        <div> Weight:<br> <b>${weight}</b></div>
        <div> Height:<br> <b>${height}</b></div>
      </div>
    </div>
  `;
}

function generateStatsTemplate(pokemon) {
  return `
    <div class="stats-container">
      ${pokemon.stats.map(stat => `
        <div class="stat-row">
          <span class="stat-name">${stat.stat.name}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width: ${stat.base_stat / 2}%;"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function generateEvolutionTemplate(pokemon) {
  if (!pokemon.evolutionChain.length) {
    return "<p>Keine Evolutionen vorhanden.</p>";
  }

  return `
    <h3>Evolution Chain</h3>
    <div class="evolution-chain">
      ${pokemon.evolutionChain.map(evo => `
        <div class="evolution-stage">
          <img src="${evo.image}" alt="${evo.name}" />
          <p>${capitalize(evo.name)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function generateOverviewTemplate(pokemon) {
  return `
    <p><strong>Species:</strong> ${pokemon.species.name}</p>
    <p><strong>Height:</strong> ${pokemon.height / 10}m | <strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
    <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => capitalize(a.ability.name)).join(", ")}</p>
  `;
}