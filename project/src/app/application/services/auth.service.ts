import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  SignInRequest,
  SignUpRequest,
  UserInfo
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authRepository: AuthRepository) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authRepository.getCurrentUser().subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.authRepository.login(request).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user || null);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authRepository.register(request).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user || null);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        localStorage.removeItem('auth_token');
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return token !== null && this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}