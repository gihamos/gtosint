/* eslint-disable eol-last */
import { SteamGameDetails, SteamGameProfilesStats } from './../../Models/SteamModel';
import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SteamGameInfos, SteamUserInfo } from '../../Models/SteamModel';
import { SteamGetProfileInfoService } from '../../Services/SteamProfile/steam-get-profile-info.service';
import { SteamGameService } from '../../Services/SteamGame/steam-game-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game-user-view',
  templateUrl: './game-user-view.component.html',
  styleUrls: ['./game-user-view.component.scss'],
  standalone: true,
  imports: [CommonModule]

})
export class GameUserViewComponent implements OnInit {

  @Output() sendDataToParent: EventEmitter<string> = new EventEmitter<string>();

  private steamUserInfoService: SteamGetProfileInfoService = inject(SteamGetProfileInfoService);
  private gameService: SteamGameService = inject(SteamGameService);

  @Input() public steamId!: string;
  @Input() public appid!: string;

  userInfo!: SteamUserInfo;
  gameInfo!: SteamGameInfos;
  gameProlfileStat!: SteamGameProfilesStats;

  getDateStr(unlocktime: number): string {
    return new Date(unlocktime * 1000).toLocaleDateString('fr-FR');
  }

  public onInit(){

    this.sendDataToParent.emit('');
  }

  ngOnInit(): void {
    // Vérification des valeurs d'entrée
    if (this.steamId && this.appid) {

      this.sendDataToParent.emit(this.appid);

      // Initialisation de l'objet userInfo et gameInfo avant d'effectuer les appels API
      this.userInfo = {} as SteamUserInfo;
      this.gameInfo = {} as SteamGameInfos;
      this.gameProlfileStat = {} as SteamGameProfilesStats;

      // Récupération des informations du profil utilisateur
      this.steamUserInfoService.getProfileInfo({ steamid: this.steamId }).subscribe({
        next: (e: SteamUserInfo) => {
          this.userInfo = e;
        },
        error: (err) => {
          console.error('Error when recovering user profile information', err);
        }
      });

      // Récupération des informations du jeu
      this.gameService.getGameData(parseInt(this.appid)).subscribe({
        next: (gamedata: SteamGameDetails) => {
          this.gameInfo.steamGameDetails = gamedata;

          // Récupération des succès du jeu
          this.steamUserInfoService.getUserStatForGame({ steamid: this.steamId, appid: this.appid }).subscribe({
            next: (stats:SteamGameProfilesStats) => {
              this.gameProlfileStat=stats;
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des succès du jeu', err);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données du jeu', err);
        }
      });
    } else {
      console.error('SteamID ou AppID manquant');
    }
  }
}
