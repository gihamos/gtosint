import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../../../../shared/models/player';
import { LocalSearchService } from '../../../services/search.service';
import { User } from '../../../../../shared/models/user.model';
import { Observable, Subject } from 'rxjs';
import { GameFull } from '../../../../../shared/models/global-models';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../shared/services/authService/auth.service';
import { ProfileService } from '../../../../profile/services/profile.service';

@Component({
  selector: 'app-search-local',
  imports: [FormsModule],
  templateUrl: './search-local.component.html',
  styleUrl: './search-local.component.scss',
})
export class SearchLocalComponent implements OnInit {

  searchPseudo = '';
  searchMail = '';
  isModifyMode = false;
  searchResults: Player[] = [];
  gamesInfosList: GameFull[] = [];

  private searchService = inject(LocalSearchService);
  private profileService = inject(ProfileService);
  private searchTerms = new Subject<string>();
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$ = this.authService.isAuthenticated$;
  user$: Observable<User | null> = this.authService.userSubject$;

  ngOnInit(): void {
    console.log('in ng init of search-local component');
  }
  onPseudoInput(): void {
    if (this.searchPseudo.length > 0) {
      this.searchService.searchPlayerByPseudo(this.searchPseudo).subscribe(
        async (results: Player[]) => {
          this.searchResults = await this.enrichPlayersWithDetails(results); // Enrichir les résultats avec les détails
        },
        (error) => {
          console.error('Error searching by pseudo:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  onMailInput(): void {
    if (this.searchMail.length > 0) {
      this.searchService.searchPlayerByMail(this.searchMail).subscribe(
        async (results: Player[]) => {
          this.searchResults = await this.enrichPlayersWithDetails(results); // Enrichir les résultats avec les détails
        },
        (error) => {
          console.error('Error searching by mail:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  // Méthode pour enrichir les joueurs avec les détails des jeux et des pays
  async enrichPlayersWithDetails(players: Player[]): Promise<Player[]> {
    const enrichedPlayers = await Promise.all(
      players.map(async (player) => {
        // Récupérer les noms des jeux
        if (player.games && player.games.length > 0) {
          player.games = await Promise.all(
            player.games.map(async (gameId) => {
              const game = await this.profileService.getGameById(gameId).toPromise();
              return game ? game.name : gameId; // Retourne le nom du jeu ou l'ID si le jeu n'est pas trouvé
            })
          );
        }

        // Récupérer les noms des pays
        if (player.countries) {
          const country = await this.profileService.getCountryById(player.countries).toPromise();
          player.countries = country ? country.name : player.countries; // Retourne le nom du pays ou l'ID si le pays n'est pas trouvé
        }

        return player;
      })
    );

    return enrichedPlayers;
  }


  getPlayerKeys(player: Player): string[] {
    return Object.keys(player);
  }

  selectGame(result: Player): void {
    // Logic to handle selection of a game
    console.log('Selected game:', result);
    // You can navigate to a different route or perform other actions here
  }
}