import axios from 'axios';

const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon";

const getPokemonById = (id) => {
  return axios.get(`${pokeApiUrl}/${id}`).then(response2 => {
    return response2.data;
  }).then(pokemonData => {
    return pokemonData;
  });
}

export const getPokemons = (offset = 0, limit = 20) => {
  return axios
  .get(`${pokeApiUrl}?offset=${offset}&limit=${limit}`)
  .then(async response => {

    const data = {...response.data};
    const results = [...response.data.results];

    const newResults = results.map(async pokemon => {
      const id = pokemon.url.slice(0, pokemon.url.length - 1).substring(pokemon.url.slice(0, pokemon.url.length - 1).lastIndexOf('/') + 1);
      const currentPokemon = await getPokemonById(id);

      return {
        ...pokemon,
        image: currentPokemon.sprites.front_shiny
      }

    });

    const finish = await Promise.all(newResults);
    data['results'] = finish;
    return data;
  });
}