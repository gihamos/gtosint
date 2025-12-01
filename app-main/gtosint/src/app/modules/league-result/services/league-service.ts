import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeagueResponse } from '../models/league-response';
import { format } from 'date-fns';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLeagueData(date: Date = new Date()) {
    const formatted = format(date, 'yyyy-MM-dd');
    const fullUrl = `${this.baseUrl}/news/leagueofLegend/infosLeague?date=${formatted}`;
    console.log('Request send to:', fullUrl);
    return this.http.get<LeagueResponse[]>(fullUrl);
  }
}