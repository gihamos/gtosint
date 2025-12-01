import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../../../environments/environment';
import { SteamCustomPseudo } from '../../Models/SteamModel';

@Injectable({
  providedIn: 'root'
})
/**
 * cette classe permet de récupérer le steamid64 d'un profil steam
 */
export class SteamGetSteamIdService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * cette méthode permet de récupérer l'identifiant steam d'un utilisateur à partir de son pseudo custom
   * @param CustomPseudo : string représente le pseudo custom de l'utilisateur steam
   * @returns : Observable<any> représente l'identifiant steam de l'utilisateur
   */
  public getSteamIdByCustomPseudo(CustomPseudo: SteamCustomPseudo): Observable<any> {
    const params = new HttpParams({ fromObject: { ...CustomPseudo } });
    return this.http.get(`${this.baseUrl}/search/advanced/steam/user/getsteamid`, { params });
  }

  /**
   * cette méthode permet de récupérer l'identifiant steam d'un utilisateur à partir de son url de profil
   * @param url : string représente l'url du profil steam
   * @returns : string représente l'identifiant steam de l'utilisateur ou null si l'url n'est pas valide
   */
  public extractSteamIdentifier(input: string): string | null {
    const regex = /steamcommunity\.com\/(?:id|profiles)\/([^/]+)/i;
    const lowerInput = input.toLowerCase();
    const match = lowerInput.match(regex);

    if (match) {
      return match[1];
    }

    const trimmedInput = input.trim();
    return trimmedInput.length > 0 ? trimmedInput : null;
  }
// eslint-disable-next-line eol-last
}
