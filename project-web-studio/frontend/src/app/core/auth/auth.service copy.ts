import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response';
import { LoginResponseType } from 'src/types/login-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  public showPrivacyPolicy$: Subject<boolean> = new Subject<boolean>;
  public showPersonalDataConsent$: Subject<boolean> = new Subject<boolean>;

  constructor(private http: HttpClient) {
    // проверяем залогинен или нет пользователь
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }

  public signup(name: string, email: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {
     name, email, password
    });
  }
  
  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Токены не найдены')

  }

  // делаем доступным приватное свойство
  public getIsLogIn() {
    return this.isLogged;
  }

  // установка токенов
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    // меняем состояние авторизации
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    // меняем состояние авторизации
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  // получение токенов
  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  refreshToken(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not use token')
  }

  // отдельно настраиваем userId
  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  public getUserName(): Observable<{ id: string, name: string, email: string }> {
    const tokens = this.getTokens();
    const headers = new HttpHeaders().set('x-auth', tokens.accessToken || '');

    return this.http.get<{ id: string, name: string, email: string }>(environment.api + 'users', { headers });
  }

  setShowPrivacyPolicy(value: boolean) {
    this.showPrivacyPolicy$.next(value);
  }

  setShowPersonalDataConsent(value: boolean) {
    this.showPersonalDataConsent$.next(value);
  }

  getShowPrivacyPolicy(): Observable<boolean> {
    return this.showPrivacyPolicy$.asObservable();
  }
  
  getShowPersonalDataConsent(): Observable<boolean> {
    return this.showPersonalDataConsent$.asObservable();
  }

}
