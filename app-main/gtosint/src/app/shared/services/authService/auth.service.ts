import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private authUrl = `${this.apiUrl}/auth`;
  private http = inject(HttpClient);
  private tokenKey = 'authToken';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  userSubject$ = this.userSubject.asObservable();


  userIsAuthenticated(): Observable<boolean> {
    const token = this.getToken();

    console.log('in userIsAtuh method');
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }
    console.log('token received in userIsAtuh method');
    return this.http.get<{ user: User }>(`${this.authUrl}/is-auth`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        this.isAuthenticatedSubject.next(true);
        console.log('is auth true');
        this.userSubject.next(response.user);
        console.log('user name : ', response.user);
      }),
      map(() => true),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        this.userSubject.next(null);
        return of(false);
      })
    );
  }

  userRegister(credentials: { name: string; email: string; password: string }): Observable<any> {
    console.log('in userRegister');
    return this.http.post<any>(`${this.authUrl}/register`, credentials, { observe: 'response' });
  }

  userLogin(credentials: { email: string; password: string }): Observable<any> {
    console.log('in user login');
    return this.http.post<{ token: string }>(`${this.authUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          //this.isAuthenticatedSubject.next(true);
          this.setToken(response.token);
          //this.userIsAuthenticated().subscribe();
          this.userIsAuthenticated();
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    window.location.reload();
  }

  getUser(): Observable<{ name: string }> {
    const token = this.getToken();
    if (!token) return of({ name: 'Utilisateur' });

    return this.http.get<{ user: { name: string } }>(`${this.authUrl}/is-auth`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.user),
      catchError(() => of({ name: 'Utilisateur' }))
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


}