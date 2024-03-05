import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PokemonService } from '../services/pokemon.service';
import { computed, effect, inject } from '@angular/core';
import {
  catchError,
  concatMap,
  firstValueFrom,
  from,
  mergeMap,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { addEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { withSelectedEntity } from './selected-entity.feature';

export interface Pokemon {
  id: number;
  name: string;
  cries: {
    legacy: string;
    latest: string;
  };
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      showdown: {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  order: number;
  types: PokemonType[];
  favorite?: boolean;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

type PokemonState = {
  filter: {
    type: string;
    order: 'asc' | 'desc';
    name: string;
  };
  page: number;
  limitPerPage: number;
  isLoading: boolean;
};

const initialState: PokemonState = {
  filter: {
    type: 'all',
    order: 'asc',
    name: '',
  },
  page: 1,
  limitPerPage: 151,
  isLoading: false,
};

export const PokemonStore = signalStore(
  { providedIn: 'root' },
  withLogger('PokemonStore'),
  withState(initialState),
  withEntities<Pokemon>(),
  withSelectedEntity(),
  withComputed(({ filter, entities }) => ({
    filtered: computed(() => {
      const direction = filter().order === 'asc' ? 1 : -1;
      return entities()
        .filter((pokemon) => {
          if (filter().type === 'all') return true;
          return pokemon.favorite === true;
        })
        .filter((pokemon) => {
          if (filter().name === '') return true;
          return pokemon.name
            .toUpperCase()
            .includes(filter().name.toUpperCase());
        })
        .sort((a, b) => direction * (a.order - b.order));
    }),
    favorites: computed(() => {
      return entities().filter((pokemon) => pokemon.favorite === true);
    }),
  })),
  withMethods((store, pokemonService = inject(PokemonService)) => ({
    updatePage: (offset: number) => {
      patchState(store, (state) => ({
        ...state,
        page: state.page + offset,
      }));
    },
    updateType: (type: string) => {
      patchState(store, (state) => ({
        ...state,
        filter: {
          ...state.filter,
          type,
        },
      }));
    },
    updateNameFilter: (name: string) => {
      patchState(store, (state) => ({
        ...state,
        filter: {
          ...state.filter,
          name,
        },
      }));
    },
    toggleFavorite: (id: number) => {
      const pokemon = store.entityMap()[id];
      if (pokemon) {
        pokemon.favorite = !pokemon.favorite;
        patchState(store, setEntity(pokemon));
      }
    },
    selectPokemon: (id: number) => {
      patchState(store, (state) => ({
        selectedEntityId: id,
      }));
    },
    selectNextPokemon: (id: number) => {
      patchState(store, (state) => ({
        selectedEntityId: id + 1,
      }));
    },
    selectPreviousPokemon: (id: number) => {
      patchState(store, (state) => ({
        selectedEntityId: id - 1,
      }));
    },
    load: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        concatMap((page) =>
          from(Array.from(Array(store.limitPerPage()).keys())).pipe(
            mergeMap((id) =>
              pokemonService.getPokemon(id + 1).pipe(
                tap((pokemon) => {
                  pokemon.favorite = false;
                  patchState(store, addEntity(pokemon));
                }),
                catchError((err) => from([])),
              ),
            ),
          ),
        ),
        tap(() => patchState(store, { isLoading: false })),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      store.load(store.page);
    },
  })),
);

export function withLogger(name: string) {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        effect(() => {
          const state = getState(store);
          console.log(`${name} state changed`, state);
        });
      },
    }),
  );
}
