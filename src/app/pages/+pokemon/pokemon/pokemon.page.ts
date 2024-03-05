import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Pokemon, PokemonStore } from '../../../store/pokemon.store';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
  ],
})
export class PokemonPage {
  private readonly store = inject(PokemonStore);
  pokemon = this.store.selectedEntity;
  nextPokemon = this.store.selectNextPokemon;
  previousPokemon = this.store.selectPreviousPokemon;
  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent,
  ) {
    const selectedId = this.store.selectedEntityId();
    if (selectedId) {
      switch (event.key) {
        case 'ArrowLeft': // left
          this.previousPokemon(+selectedId);
          break;
        case 'ArrowRight': // right
          this.nextPokemon(+selectedId);
          break;
        case 'f': //F
          this.toggleFavorite();
          break;
      }
    }
  }

  async toggleFavorite() {
    const selectedId = this.store.selectedEntityId();
    if (selectedId) this.store.toggleFavorite(+selectedId);
  }
}
