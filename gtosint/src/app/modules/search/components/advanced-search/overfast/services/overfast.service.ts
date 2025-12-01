import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverfastRequest } from '../models/overfast-request';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OverfastService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendOverReq(data: OverfastRequest): Observable<any> {
    const params = new HttpParams({ fromObject: { ...data } });
    return this.http.get(`${this.baseUrl}/search/advanced/overfast`, { params });
  }
}