import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClashRequest } from '../models/cr-request';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClashService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlayerData(data: ClashRequest): Observable<any>{
    const params = new HttpParams({ fromObject: { ...data }});
    return this.http.get(`${this.baseUrl}/search/advanced/CR`, {params});
  }
}