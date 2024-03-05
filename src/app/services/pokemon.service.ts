import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../store/pokemon.store';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);

  getPokemon(id: number) {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }
}
