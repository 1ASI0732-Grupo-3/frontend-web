import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserRole } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl extends AuthRepository {

  login(request: LoginRequest): Observable<AuthResponse> {
    // Mock implementation
    if (request.email === 'admin@vacapp.com' && request.password === 'admin123') {
      const user: User = {
        id: '1',
        name: 'Juan Jose',
        email: request.email,
        role: UserRole.ADMIN,
        createdAt: new Date()
      };
      
      const response: AuthResponse = {
        user,
        token: 'mock-token-123'
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('vacapp_user', JSON.stringify(user));
      localStorage.setItem('vacapp_token', response.token);
      
      return of(response).pipe(delay(1000));
    }
    
    return throwError({ message: 'Invalid credentials' }).pipe(delay(1000));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    // Mock implementation
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: request.name,
      email: request.email,
      role: UserRole.VETERINARIAN,
      createdAt: new Date()
    };
    
    const response: AuthResponse = {
      user,
      token: 'mock-token-' + user.id
    };
    
    localStorage.setItem('vacapp_user', JSON.stringify(user));
    localStorage.setItem('vacapp_token', response.token);
    
    return of(response).pipe(delay(1000));
  }

  logout(): Observable<void> {
    localStorage.removeItem('vacapp_user');
    localStorage.removeItem('vacapp_token');
    return of(void 0);
  }

  getCurrentUser(): Observable<User | null> {
    const userStr = localStorage.getItem('vacapp_user');
    if (userStr) {
      return of(JSON.parse(userStr));
    }
    return of(null);
  }
}