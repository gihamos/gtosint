import { SteamGameService } from './../SteamGame/steam-game-service.service';
import { SteamFrendProfileRequest, SteamProfileGamesInfoRequest, SteamGetlastplayedRequest } from '../../Models/SteamModelRequest';
import { concatMap, from, map, Observable, of, switchMap, toArray } from 'rxjs';
import { SteamFrendProfile, SteamUserInfo, SteamId, SteamGameInfos, SteamGameProfilesStats, SteamProfileGamesAchevements, SteamCarouselItem } from '../../Models/SteamModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * Cette classe permet de récupérer les informations du profil d'un joueur Steam
 */
export class SteamGetProfileInfoService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private gameService: SteamGameService) { }

  /**
   * Méthode permettant de récupérer les informations du profil d'un joueur Steam
   * @param steamid : Interface contenant le steamid64 du joueur
   * @returns Observable<SteamUserInfo>
   */
  public getProfileInfo(steamid: SteamId): Observable<SteamUserInfo> {
    const params = new HttpParams({ fromObject: { ...steamid } });
    return this.http.get<SteamUserInfo>(`${this.baseUrl}/search/advanced/steam/user`, { params });
  }

  /**
   * Méthode permettant de retourner tous les jeux d'un profil Steam
   * @param steamidResponse : Interface contenant le steamid64 du joueur
   * @returns Observable<SteamGameInfos[]>
   */
  public getGames(steamidResponse: SteamId): Observable<SteamGameInfos[]> {
    const params = new HttpParams({ fromObject: { ...steamidResponse } });
    return this.http.get<SteamGameInfos[]>(`${this.baseUrl}/search/advanced/steam/user/owned-games`, { params });
  }

  /**
   * Cette méthode permet de retourner les statistiques d'un jeu pour le profil du joueur
   * @param steamProfileGamesInfoRequest : Requête pour récupérer les statistiques d'un jeu
   * @returns Observable<SteamGameProfilesStats>
   */
  public getUserStatForGame(steamProfileGamesInfoRequest: SteamProfileGamesInfoRequest): Observable<SteamGameProfilesStats> {
    const parmObject: Record<string, string | number> = {
      steamid: steamProfileGamesInfoRequest.steamid,
      appid: steamProfileGamesInfoRequest.appid
    };

    if (steamProfileGamesInfoRequest.language) {
      parmObject['language'] = steamProfileGamesInfoRequest.language;
    }

    const params = new HttpParams({ fromObject: { ...parmObject } });
    return this.http.get<SteamGameProfilesStats>(`${this.baseUrl}/search/advanced/steam/user/player-stats`, { params });
  }

  /**
   * Cette méthode permet de retourner les succès d'un jeu débloqué ou à débloquer par le joueur
   * @param steamProfileGamesInfoRequest : Requête pour récupérer les succès d'un jeu
   * @returns Observable<SteamProfileGamesAchevements>
   */
  public getUserAchevementForGame(steamProfileGamesInfoRequest: SteamProfileGamesInfoRequest): Observable<SteamProfileGamesAchevements> {
    const parmObject: Record<string, string | number> = {
      steamid: steamProfileGamesInfoRequest.steamid,
      appid: steamProfileGamesInfoRequest.appid
    };

    if (steamProfileGamesInfoRequest.language) {
      parmObject['language'] = steamProfileGamesInfoRequest.language;
    }

    const params = new HttpParams({ fromObject: { ...parmObject } });
    return this.http.get<SteamProfileGamesAchevements>(`${this.baseUrl}/search/advanced/steam/user/owned-games`, { params });
  }

  /**
   * Méthode permettant de retourner la liste des amis du profil Steam. La visibilité du profil doit être publique avant l'appel de cette méthode
   * @param steamFrendProfileRequest : Requête pour récupérer la liste des amis
   * @returns Observable<SteamFrendProfile[]>
   */
  public getFriends(steamFrendProfileRequest: SteamFrendProfileRequest): Observable<SteamFrendProfile[]> {
    const params = new HttpParams({ fromObject: { ...steamFrendProfileRequest } });
    return this.http.get<SteamFrendProfile[]>(`${this.baseUrl}/search/advanced/steam/user/friends`, { params });
  }

  /**
   * Cette méthode permet de retourner les jeux récemment joués par le joueur.
   * @param steamGetlastplayedRequest : Requête pour récupérer les jeux récemment joués
   * @returns Observable<SteamGameInfos[]>
   */
  public getRecentelyGamePlayed(steamGetlastplayedRequest: SteamGetlastplayedRequest): Observable<SteamGameInfos[]> {
    const paramObject: Record<string, string | number> = {
      steamid: steamGetlastplayedRequest.steamid,
    };

    if (steamGetlastplayedRequest.count) {
      paramObject['count'] = steamGetlastplayedRequest.count;
    }

    const params = new HttpParams({ fromObject: { ...paramObject } });
    return this.http.get<SteamGameInfos[]>(`${this.baseUrl}/search/advanced/steam/user/lastplayedgames`, { params });
  }

  /**
   * Cette méthode permet de retourner les derniers jeux joués pour le profil, en incluant des informations supplémentaires pour un carousel
   * @param profileInfo : Informations du profil de l'utilisateur
   * @returns Observable<SteamCarouselItem[]>
   */
  public getLastPlayedGamesForView(profileInfo: SteamUserInfo | undefined): Observable<SteamCarouselItem[]> {
    if (!profileInfo) {
      return of([]);
    }

    return this.getRecentelyGamePlayed({ steamid: profileInfo.steamid }).pipe(
      switchMap(steamGameInfos =>
        from(steamGameInfos).pipe(
          concatMap(e =>
            this.gameService.getGameData(e.steamGameId.appid).pipe(
              map(gdetail => {
                e.steamGameDetails = gdetail;
                return {
                  link: encodeURI('steam/user/' + profileInfo.steamid + '/game/' + e.steamGameId.appid),
                  backgroundImage: gdetail.header_image,
                  title: gdetail.name,
                  description: `<p>Le nombre total des succès à débloquer : ${gdetail.achievements?.total || 'inconnu'}
                                pour ce jeu.<br> Dernier temps du jeu pour ${profileInfo.personaname} : ${new Date(e.playtime_2weeks * 10000).getMinutes()} minutes</p>`
                };
              })
            )
          ),
          toArray()
        )
      )
    );
  }
// eslint-disable-next-line eol-last
}
