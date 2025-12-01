import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SteamAuthService {
  /**
   * URL de l'API Steam
   */
  private apiUrl = 'http://localhost:3000/steam/auth';
  constructor(private http:HttpClient) { }

  /**
   *  methode pour Rediriger l'utilisateur vers Steam pour l'authentification
   */
  loginWithSteam(): void {
    window.location.href = `${this.apiUrl}/login`;
  }

  /**
   * Vérifie si l'utilisateur est connecté et récupère ses infos
   */
  checkLoginStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`, { withCredentials: true });
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true });
  }

}