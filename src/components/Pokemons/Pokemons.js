import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { getPokemons } from '../../helpers/getPokemons';
import Loading from '../Loading/Loading';
import './Pokemons.css';

const Pokemons = () => {
  const limit = 24;
  
  const pokemonsContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  
  const [pokemons, setPokemons] = useState(
    { data: null }
  );
    
  useEffect(() => {
    pokemonsContainer && pokemonsContainer.current.addEventListener('DOMNodeInserted', event => {
      const { currentTarget: target } = event;
      target.scroll({ top: target.scrollHeight - target.clientHeight, behavior: 'smooth'});
      console.log(target.scrollHeight, target.clientHeight, target.scrollHeight - target.clientHeight);
    });
  }, [pokemons]);

  const fetchPokemons = () => {
    setIsLoading(true);

    getPokemons(offset, limit)
    .then(pokemonsData => {

      if (pokemons.data) {
        const currentData = {...pokemons.data};
        const newResults = [...currentData.results, ...pokemonsData.results];
        currentData['results'] = newResults;

        setPokemons(
          {
            data: currentData
          }
        )
      } else {
        setPokemons(
          {
            data: pokemonsData
          }
        );
      }

      setOffset(offset + limit);
      setIsLoading(false);
    })
    .catch(() => {
      setIsLoading(false);
    })
  }

  return (
    <div className="p-3 d-flex flex-column test">
      <h1 className="text-center flex-shrink-0">Pokemons</h1>

        <div className="p-3 pokemons row position-relative text-center flex-grow-1" ref={pokemonsContainer}>
          { pokemons.data && pokemons.data.results.map((pokemon, index) => {
              return (
                <div className="col-12 col-sm-6 col-md-3 col-xl-2 py-2" key={index}>
                  <Card>
                  <Card.Img variant="top" src={pokemon.artwork} />
                    <Card.Body>
                      <Card.Title className="text-center">{pokemon.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              )
            })
          }
          {
            isLoading ? <Loading /> : ''
          }
        </div>

      <div className="d-flex justify-content-center align-items-center pt-3 flex-shrink-0">
        <button className="btn btn-primary" disabled={ isLoading } onClick={ fetchPokemons }>{ isLoading ? 'Loading pokemons...' : 'Fetch Pokemons' }</button>
      </div>


    </div>
  )
}

export default Pokemons;