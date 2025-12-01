import { SteamSearchGameNewsRequest } from '../../Models/SteamModelRequest';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { SteamGameDetails, SteamNewsItem } from '../../Models/SteamModel';


@Injectable({
  providedIn: 'root'
})
export class SteamGameService {

  private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  /**
    * cette methode permet de retourner les informations d'un jeu steam
    * @param steamSearchGameNewsRequest
    * @returns
    */
  public getGameNews(steamSearchGameNewsRequest:SteamSearchGameNewsRequest):Observable<SteamNewsItem[]>{

    const params=new HttpParams({fromObject: { ...steamSearchGameNewsRequest }});
    return this.http.get<SteamNewsItem[]>(`${this.baseUrl}/search/advanced/steam/getnewsgame`, {params});
  }

  /**
   * Récupère la liste des images des jeux Steam à partir d'une liste d'appids.
   * @param appid identifiant unique du jeu.
   * ex: ['123','550']
   * @returns Observable renvoyant un objet conforme à GameImage[ ].
   */
  public getGameData(appid:number): Observable<SteamGameDetails> {

    return this.http.get<SteamGameDetails>(`${this.baseUrl}/search/advanced/steam/getdetailgame?appid=${appid}`);
  }
// eslint-disable-next-line eol-last
}
