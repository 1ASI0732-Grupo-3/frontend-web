import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';

  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    // Verificar si hay token al inicializar
    const token = this.getToken();
    if (token) {
      console.log('✅ Token encontrado al inicializar aplicación');
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
    console.log('🔐 Token guardado exitosamente');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSubject.next(null);
    console.log('🗑️ Token eliminado');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  setUserInfo(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log('👤 Información de usuario guardada');
  }

  setUser(user: any): void {
    this.setUserInfo(user);
  }

  getUserInfo(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
