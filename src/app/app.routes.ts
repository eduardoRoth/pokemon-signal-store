import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokemons',
  },
  {
    path: 'pokemons',
    loadComponent: () =>
      import('./pages/+pokemon/pokemons/pokemons.page').then(
        (c) => c.PokemonsPage,
      ),
  },
  {
    path: 'pokemon',
    loadComponent: () =>
      import('./pages/+pokemon/pokemon/pokemon.page').then(
        (c) => c.PokemonPage,
      ),
  },
];
