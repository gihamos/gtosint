import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SteamUserInfo, SteamId} from '../../Models/SteamModel';
import { SteamGetProfileInfoService } from '../../Services/SteamProfile/steam-get-profile-info.service';
import { CommonModule } from '@angular/common';
import { Countries } from '../../Models/dataCountrie';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GameUserViewComponent } from '../game-user-view/game-user-view.component';

@Component({
  selector: 'app-steam-user-home',
  imports: [CommonModule, FormsModule, GameUserViewComponent],
  templateUrl: './steam-user-home.component.html',
  styleUrl: './steam-user-home.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class SteamUserHomeComponent implements OnInit {
  private steamUserInfoService: SteamGetProfileInfoService = inject(SteamGetProfileInfoService);
  public ProfileInfo: SteamUserInfo | undefined;
  @Input() public steamid!: string;
  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();
  public appid!:string;
  idGamesForUser: { appid: string, name: string }[] = [];

  //variable pour la recherche
  searchTerm = '';
  filteredGames: { appid: string, name: string }[] = [];
  selectedGame?: { appid: string, name: string };
  constructor(private route: ActivatedRoute, private router2: Router) { }

  handleDataFromChild(data: string) {
    this.appid = data;
  }

  public onInit(){

    this.sendDataToParent.emit('');
  }


  ngOnInit(): void {
    // Récupération du steamid des query parameters
    if (this.steamid) {
      this.sendDataToParent.emit(this.steamid);
      const steamId: SteamId = { steamid: this.steamid };
      this.steamUserInfoService.getProfileInfo(steamId).subscribe(data => {
        data.loccountrycode = Countries.find((e) => e.code.toLowerCase() == data.loccountrycode?.toLowerCase())?.name || 'Unknown';
        this.ProfileInfo = data;
        if (this.ProfileInfo) {
          this.steamUserInfoService.getGames({ steamid: this.ProfileInfo?.steamid }).pipe(
            map(steamGamesInfos => steamGamesInfos.map(gameInfo => ({
              appid: gameInfo.steamGameId.appid.toString(),
              name: gameInfo.steamGameId.title || gameInfo.steamGameId.appid.toString()
            }))),
          ).subscribe(e => {
            this.idGamesForUser = e;
          });
        }

      });
    }
  }

  public getDateStr(number: any): string {
    return new Date(number * 1000).toLocaleString();
  }

  // Méthode appelée lors de la saisie dans l'input
  handleSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();

    // Réinitialiser la liste des jeux affichés si le terme est trop court
    if (this.searchTerm.length < 3) {
      this.filteredGames = [];
      return;
    }

    // Filtrer les jeux correspondant au terme recherché
    this.filteredGames = this.idGamesForUser.filter(game =>
      game.name.toLowerCase().includes(this.searchTerm)
    );
  }

  // Méthode appelée lorsqu'un jeu est sélectionné
  onSelect(game: { appid: string, name: string }): void {
    this.selectedGame = game;
    this.appid = game.appid;
    // Mise à jour du champ de recherche avec le nom du jeu sélectionné
    this.searchTerm = game.name.toLowerCase();
    // Réinitialiser la liste après sélection
    this.filteredGames = [];
  }
// eslint-disable-next-line eol-last
}
