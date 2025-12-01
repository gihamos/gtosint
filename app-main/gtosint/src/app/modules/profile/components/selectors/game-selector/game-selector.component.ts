import { Component, inject, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { GameFull } from '../../../../../shared/models/global-models';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { GameCardComponent } from '../../games/game-card/game-card.component';

@Component({
  selector: 'app-game-selector',
  imports: [FormsModule, GameCardComponent],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent implements OnInit {
  @Input() gamesId: string[] = [];
  @Input() userId = '';

  newGame = '';
  isModifyMode = false;
  searchResults: GameFull[] = [];
  private searchTerms = new Subject<string>();
  private profileService = inject(ProfileService);

  playerProfile$ = this.profileService.playerProfile$;
  gamesInfosList: GameFull[] = [];

  ngOnInit(): void {
    console.log(`in game selector component with g : ${this.gamesId} and user ${this.userId}`);

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.profileService.searchGames(query))
      )
      .subscribe({
        next: (games) => {
          this.searchResults = games;
          console.log('res games received', games);
        },
        error: (err) => {
          console.error('Failed to search games:', err);
        },
      });

    this.profileService.playerProfile$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((player) => {
        if (player && player.games) {
          this.gamesInfosList = []; // Réinitialise la liste des jeux
          console.log('Player games IDs:', player.games); // Log les IDs des jeux
          player.games.forEach((gameId) => {
            this.profileService.getGameById(gameId).subscribe({
              next: (game) => {
                console.log('Game loaded:', game); // Log le jeu chargé
                if (game) {
                  if (!this.gamesInfosList.some((g) => g.id === game.id)) {
                    this.gamesInfosList.push(game);
                  }
                }
              },
              error: (err) => {
                console.error('Failed to load game info:', err);
              },
            });
          });
          console.log('user games list', this.gamesInfosList);
        }
      });
  }

  toggleModifyMode(): void {
    this.isModifyMode = !this.isModifyMode;
    this.searchResults = [];
    this.newGame = '';
  }

  search(query: string): void {
    if (query.length > 0) {
      console.log('in search game with query', query);
      this.searchTerms.next(query);
    }
  }

  selectGame(game: GameFull): void {
    this.newGame = game.name;
    this.searchResults = [];

    console.log('game id to add', game);
    this.profileService.addGame(this.userId, game.id);
    this.isModifyMode = false;
  }
}