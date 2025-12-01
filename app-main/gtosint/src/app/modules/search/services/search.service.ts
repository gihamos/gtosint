import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Player } from '../../../shared/models/player';

@Injectable({
  providedIn: 'root',
})
export class LocalSearchService {
  private apiUrl = environment.apiUrl;
  private localSearchUrl = `${this.apiUrl}/search/local`;
  private http = inject(HttpClient);

  searchPlayerByMail(mail: string): Observable<Player[]> {
    const params = new HttpParams().set('mail', mail);
    return this.http.get<Player[]>(`${this.localSearchUrl}/mail`, { params });
  }

  searchPlayerByPseudo(pseudo: string): Observable<Player[]> {
    const params = new HttpParams().set('pseudo', pseudo);
    return this.http.get<Player[]>(`${this.localSearchUrl}/pseudo`, { params });
  }
}