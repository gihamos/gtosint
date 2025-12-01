import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RiotRequest } from '../models/riot-request';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RiotService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRiotData(data: RiotRequest): Observable<any> {
    const params = new HttpParams({ fromObject: { ...data } });
    return this.http.get(`${this.baseUrl}/search/advanced/riot`, { params });
  }
}