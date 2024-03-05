import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Pokemon, PokemonStore } from '../../../store/pokemon.store';
import {
  InfiniteScrollCustomEvent,
  ModalController,
  SearchbarChangeEventDetail,
  SearchbarInputEventDetail,
} from '@ionic/angular';
import { PokemonPage } from '../pokemon/pokemon.page';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.page.html',
  styleUrls: ['./pokemons.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonRow,
    IonCol,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonChip,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    PokemonPage,
  ],
  providers: [ModalController],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsPage {
  private readonly store = inject(PokemonStore);
  private readonly modalCtrl = inject(ModalController);
  pokemons = this.store.filtered;
  loading = this.store.isLoading;
  type = this.store.filter.type;

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async viewPokemon(id: number) {
    this.store.selectPokemon(id);
    const modal = await this.modalCtrl.create({
      component: PokemonPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
    });
    modal.present();
  }

  async updateType(type: string) {
    this.store.updateType(type);
  }

  async updateNameFilter(event: any) {
    this.store.updateNameFilter(event?.detail?.value);
  }
}
