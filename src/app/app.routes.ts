import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/+pokemon/pokemons/pokemons.page').then(
        (c) => c.PokemonsPage,
      ),
  },
];
