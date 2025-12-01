import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player } from '../../../shared/models/player';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CountryFull, GameFull } from '../../../shared/models/global-models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = environment.apiUrl;
  private playersUrl = `${this.apiUrl}/players`;
  private dataUrl = `${this.apiUrl}/data`;
  private http = inject(HttpClient);

  private playerProfileSubject = new BehaviorSubject<Player | null>(null);
  playerProfile$ = this.playerProfileSubject.asObservable();

  getCountryById(countryId: string): Observable<CountryFull> {
    return this.http.get<CountryFull>(`${this.dataUrl}/countries/${countryId}`);
  }

  getGameById(gameId: string): Observable<GameFull> {
    return this.http.get<GameFull>(`${this.dataUrl}/games/${gameId}`);
  }

  searchCountries(query: string): Observable<CountryFull[]> {
    console.log('in searchcountries with', query);
    const params = new HttpParams().set('query', query);
    return this.http.get<CountryFull[]>(`${this.dataUrl}/countries`, { params }).pipe(
      tap((response) => console.log('Raw response from backend:', response)),
      map((response) => response as CountryFull[])
    );
  }

  searchGames(query: string): Observable<GameFull[]> {
    console.log('in searchgame with', query);
    const params = new HttpParams().set('query', query);
    return this.http.get<GameFull[]>(`${this.dataUrl}/games`, { params });
  }

  getPlayerInfos(userId: string): void {
    this.http.get<Player>(`${this.playersUrl}/${userId}`).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  addGame(userId: string, gameId: string): void {
    console.log('params', userId, 'and', gameId);
    this.http.post<Player>(`${this.playersUrl}/${userId}/games`, { gameId }).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  addPseudo(userId: string, pseudo: string): void {
    this.http.post<Player>(`${this.playersUrl}/${userId}/pseudos`, { pseudo }).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  addCountry(userId: string, countryId: string): void {
    this.http.post<Player>(`${this.playersUrl}/${userId}/countries`, { countryId }).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  deletePseudo(userId: string, pseudo: string): void {
    this.http.delete<Player>(`${this.playersUrl}/${userId}/pseudos`, { body: { pseudo } }).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  deleteGame(userId: string, gameId: string): void {
    this.http.delete<Player>(`${this.playersUrl}/${userId}/games`, { body: { gameId } }).subscribe(player => {
      this.playerProfileSubject.next(player);
    });
  }

  deleteUser(userId: string, email: string): void {
    console.log('email:', email);
    this.http.delete<Player>(`${this.playersUrl}/${userId}`, { body: { email } }).subscribe( () => {
      window.location.reload();
    },
    (error) => {
      console.error('Error deleting user:', error);
    }
    );
  }

}